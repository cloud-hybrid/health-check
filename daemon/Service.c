#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <syslog.h>

#ifndef MAX_BUF
#define MAX_BUF 200
#endif

static void skeleton(char * cwd) {
    /*****
    Daemon Management ABI
    
    - Commands are ran sequentially.
    - Be mindful of fork(), signal(), & exit() order.
    */
    
    pid_t pid;

    /* Fork off the parent process */
    pid = fork();

    /* An error occurred */
    if (pid < 0) exit(EXIT_FAILURE);

    /* Success: Let the parent terminate */
    if (pid > 0) exit(EXIT_SUCCESS);

    /* On success, the child process becomes session leader */
    if (setsid() < 0) exit(EXIT_FAILURE);

    /* Catch, ignore and handle signals */
    signal(SIGCHLD, SIG_IGN);
    signal(SIGHUP, SIG_IGN);

    /* Fork off for the second time*/
    pid = fork();

    /* An error occurred */
    if (pid < 0) exit(EXIT_FAILURE);

    /* Success: Let the parent terminate */
    if (pid > 0) exit(EXIT_SUCCESS);

    /* Set new file permissions */
    umask(0);

    /* Change the working directory to the root directory */
    /* or another appropriated directory */
    chdir(cwd);

    /* Close all open file descriptors */
    for (int x = sysconf(_SC_OPEN_MAX); x >= 0; x--) close (x);

    /* Open the log file */
    openlog("Health-Check-API", LOG_PID, LOG_DAEMON);

    system("npm run start");
}

int main() {
    char path[MAX_BUF];

    errno = 0;

    if (getcwd(path, MAX_BUF) == NULL) {
        if (errno == ERANGE) printf(
            "[ERROR] Buffer Overflow in PATH Name\n"
        ); else perror("getcwd");

        exit(EXIT_FAILURE);
    }

    printf("Current Working Directory: %s\n", path);

    syslog(LOG_NOTICE, "Starting Daemon Process ...");

    skeleton(path);

    syslog (LOG_NOTICE, "Terminated Daemon Process");

    closelog();

    return EXIT_SUCCESS;
}
