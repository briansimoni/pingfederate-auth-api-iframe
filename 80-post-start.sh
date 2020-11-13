#!/usr/bin/env sh

#

# Ping Identity DevOps - Docker Build Hooks

#

#- This script is started in the background immediately before

#- the server within the container is started

#-

#- This is useful to implement any logic that needs to occur after the

#- server is up and running

#-

#- For example, enabling replication in PingDirectory, initializing Sync

#- Pipes in PingDataSync or issuing admin API calls to PingFederate or PingAccess

 

# shellcheck source=pingcommon.lib.sh

# rm -rf /opt/out/instance/server/default/conf/template

ln -s /dist /opt/out/instance/server/default/conf/template/assets/custom-login
rm /opt/out/instance/server/default/data/config-store/response-header-runtime-config.xml
cp dist/response-header-runtime-config.xml /opt/out/instance/server/default/data/config-store/response-header-runtime-config.xml

. "${HOOKS_DIR}/pingcommon.lib.sh"