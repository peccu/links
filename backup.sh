#!/bin/bash
. .env
rs-backup -u $RS_USER -t $RS_TOKEN -o .backup
