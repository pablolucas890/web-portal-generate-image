#!/bin/bash

PROCESS_BASE=$1

processo=`ps -f --ppid $PROCESS_BASE -o pid | tail -n 1 | sed -e 's/^[ \t]*//'`

while [ "$processo" != "PID" ]; do
	kill $processo
	processo=`ps -f --ppid $processo -o pid | tail -n 1 | sed -e 's/^[ \t]*//'`
done

exit 0