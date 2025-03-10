# Team Credentials Documentation

This document contains all the necessary information for logging into the team's server and database.

## Server Access and Database Connection Instructions

To access the server, you will need the following information:

- **Server IP Address:** `13.60.184.80`
- **Key Pair:** `gdsd-team2.pem`
- **Available Users:** `ubuntu, root`

### Connecting to the Server

1. Open your terminal or SSH client.
2. Use the following command to connect to the server:

`ssh -i <key pair> ubuntu@13.60.184.80`

To switch to a root user, use the following:

`sudo su -l`

### Connecting to the Database

- **Host:** `gdsd-team2-db.cvmec6kayr7v.eu-north-1.rds.amazonaws.com`
- **Port:** `3306`
- **Master DBA:** `team2`
- **Master Password:** `Z3cqV44SRi6ef2dX5rCo`
