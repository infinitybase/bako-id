up:
	docker compose -p bako-id_dev --env-file .env up -d --build

down:
	docker compose -p bako-id_dev stop

clean:
	docker compose -p bako-id_dev down --rmi local -v --remove-orphans
