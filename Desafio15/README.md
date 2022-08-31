# Desafío 15 
## Servidor con Balance de Carga

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

En esta entrega se implementa el balance de carga al momento de iniciar el servidor de la aplicación desarrollada. Se ejecutó en primer nivel el levantamiento del servidor como FORK y luego en modo CLUSTER. 

Igualmente se implementó el balance de carga con NGINX. A continuación se describen los comandos en CLI para realizar los test respectivos:

## Features

1. Ejecutar en modo CLUSTER 

```console
node server.js -p 8082 -b CLUSTER
Node CLUSTER 11879 ejecutándose
Server executing address 8082 and using CLUSTER as balancer of charge. Process ID 11882
WORKER 11882 listening on 8082
Server executing address 8082 and using CLUSTER as balancer of charge. Process ID 11884
WORKER 11884 listening on 8082
Server executing address 8082 and using CLUSTER as balancer of charge. Process ID 11883
WORKER 11883 listening on 8082
Server executing address 8082 and using CLUSTER as balancer of charge. Process ID 11885
```

2. Ejecutar en modo FORK

```console
node server -p 8081
Server executing address 8081 and using FORK as balancer of charge. Process ID 11924
[MENSAJE] Connected to MongoDB
[PRODUCTO] Connected to MongoDB
```

3. Modo CLUSTER y FORK con PM2 

```console
npx pm2 start server.js -- 8080 FORK
[PM2] Starting /Users/victorvega/Documents/Desafio_1/Desafio15/server.js in fork_mode (1 instance)
[PM2] Done.
```

```console
npx pm2 start server_2.js --watch -i max -- -p 8081 -b CLUSTER
[PM2] Starting /Users/victorvega/Documents/Desafio_1/Desafio15/server_2.js in cluster_mode (0 instance)
[PM2] Done.
```

```console
npx pm2 list
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ server      │ default     │ 1.0.0   │ fork    │ 23755    │ 73s    │ 0    │ online    │ 0%       │ 69.9mb   │ vic… │ disabled │
│ 1   │ server_2    │ default     │ 1.0.0   │ cluster │ 24442    │ 0s     │ 32   │ online    │ 0%       │ 25.8mb   │ vic… │ enabled  │
│ 2   │ server_2    │ default     │ 1.0.0   │ cluster │ 24437    │ 0s     │ 32   │ online    │ 0%       │ 34.6mb   │ vic… │ enabled  │
│ 3   │ server_2    │ default     │ 1.0.0   │ cluster │ 24426    │ 1s     │ 31   │ online    │ 0%       │ 45.4mb   │ vic… │ enabled  │
│ 4   │ server_2    │ default     │ 1.0.0   │ cluster │ 24432    │ 0s     │ 31   │ online    │ 0%       │ 41.0mb   │ vic… │ enabled  │
```

4. Realizar la configuración del archivo CONFIG de NGINX 

```console
npx pm2 start server.js --name="ClusterEn8082" --watch -i 2  -- -p 8082
npx pm2 start server.js --name="ClusterEn8083" --watch -i 2  -- -p 8083
npx pm2 start server.js --name="ClusterEn8084" --watch -i 2  -- -p 8084
npx pm2 start server.js --name="ClusterEn8085" --watch -i 2  -- -p 8085
```

5. Configuración del archivo Nginx.conf 

```console
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    upstream node_app_cluster {
        server 127.0.0.1:8081;
    }

    upstream node_app {
        server 127.0.0.1:8080;
    }

    upstream backend {
        server 127.0.0.1:8082;
        server 127.0.0.1:8083;
        server 127.0.0.1:8084;
        server 127.0.0.1:8085;
    }

    server {
        listen       80;
        # server_name  localhost;
        server_name nginx_node;
        root /usr/local/etc/Desafio15/public;

        location /api/randoms {
            proxy_pass http://node_app_cluster;
        }

        location / {
            proxy_pass http://node_app;
        }

        location /api/randoms/ {
            proxy_pass http://backend/api/randoms/;
        }
    

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

    include servers/*;
}
```

6. Se inicia nginx
```console
sudo nginx
```

7. Y se realiza las pruebas en el localhost correspondiente
```console
npx pm2 monit

│[ 0] ClusterEn8082     Mem:  65 MB    CPU:  ││ ClusterEn8082 > Server executing address 8082 and using FORK as balancer of charge. Process ID 4273       │
│[ 1] ClusterEn8082     Mem:  66 MB    CPU:  ││ ClusterEn8082 > [MENSAJE] Connected to MongoDB                                                            │
│[ 2] ClusterEn8083     Mem:  65 MB    CPU:  ││ ClusterEn8082 > [PRODUCTO] Connected to MongoDB                                                           │
│[ 3] ClusterEn8083     Mem:  65 MB    CPU:  ││ ClusterEn8082 > Server executing address 8082 and using FORK as balancer of charge. Process ID 4351       │
│[ 4] ClusterEn8084     Mem:  65 MB    CPU:  ││ ClusterEn8082 > [MENSAJE] Connected to MongoDB                                                            │
│[ 5] ClusterEn8084     Mem:  65 MB    CPU:  ││ ClusterEn8082 > [PRODUCTO] Connected to MongoDB                                                           │
│[ 6] ClusterEn8085     Mem:  65 MB    CPU:  ││                                                                                                           │
│[ 7] ClusterEn8085     Mem:  65 MB    CPU:  ││                                                                                                           │
│                                            ││                                                                                                           │
│                                            ││                                                                                                           │
└────────────────────────────────────────────┘└─────────────────────────────────────────────────────────────────
```
