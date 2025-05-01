THIS_FILE := $(lastword $(MAKEFILE_LIST))
.PHONY: test backup help build up start down destroy stop restart logs logs-api ps login-timescale login-api db-shell
push:
	docker compose -f docker-compose-build.yml push api cli	
pull:
	docker compose -f docker-compose-build.yml pull api cli
	docker compose -f docker-compose-build.yml rm api cli
	docker compose -f docker-compose-build.yml up -d api cli
backup:
	# docker run --rm --volumes-from mongo -v .\backup:/backup ubuntu tar cvf /backup/backup.tar /data/db
	# scp -p .\backup\backup.tar root@185.221.155.147:/home/espnode/backup/
restore:
	docker run --rm --volumes-from mongo -v /home/espnode/backup:/backup ubuntu bash -c 'cd /data/db && tar xvf /backup/backup.tar --strip 2'
	docker compose -f docker-compose-production.yml restart mongo
build:
	docker compose -f docker-compose-build.yml build $(c)
up:
	docker compose -f docker-compose-development.yml up -d $(c)
start:
	docker compose -f docker-compose-development.yml start $(c)
down:
	docker compose -f docker-compose-development.yml down $(c)
destroy:
	docker compose -f docker-compose-development.yml down -v $(c)
stop:
	docker compose -f docker-compose-development.yml stop $(c)
restart:
	docker compose -f docker-compose-development.yml stop $(c)
	docker compose -f docker-compose-development.yml up -d $(c)
logs:
	docker compose -f docker-compose-development.yml logs --tail=100 -f $(c)
logs-api:
	docker compose -f docker-compose-development.yml logs --tail=100 -f api
ps:
	docker compose -f docker-compose-development.yml ps
login-timescale:
	docker compose -f docker-compose-development.yml exec timescale /bin/bash
login-api:
	docker compose -f docker-compose-development.yml exec api /bin/bash
db-shell:
	docker compose -f docker-compose-development.yml exec timescale psql -Upostgres