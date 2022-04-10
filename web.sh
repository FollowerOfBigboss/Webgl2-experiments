#!/bin/bash
# https://stackoverflow.com/questions/242538/unix-shell-script-find-out-which-directory-the-script-file-resides
BASEDIR=$(dirname "$0")
cd ${BASEDIR}
python3 -m http.server
