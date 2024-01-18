#!/bin/bash

declare -a files=("lib.libavtor.sql.gz"
                  "lib.libtranslator.sql.gz"
                  "lib.libavtorname.sql.gz"
                  "lib.libbook.sql.gz"
                  "lib.libfilename.sql.gz"
                  "lib.libgenre.sql.gz"
                  "lib.libgenrelist.sql.gz"
                  "lib.libjoinedbooks.sql.gz"
                  "lib.librate.sql.gz"
                  "lib.librecs.sql.gz"
                  "lib.libseqname.sql.gz"
                  "lib.libseq.sql.gz")

downloadSQL() {
  local filename=$1
  curl -s https://flibusta.site/sql/$filename --output /docker-entrypoint-initdb.d/$filename
}

for name in "${files[@]}"; do
  downloadSQL "$name" &
  downloadPids="$downloadPids $!"
done

wait $downloadPids

gunzip -f /docker-entrypoint-initdb.d/*.sql.gz