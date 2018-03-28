#!/bin/bash
service redis_6379 start
service mongod start

pip3 install -r requirements.txt

cd news_pipeline
python3 news_monitor.py &
python3 news_fetcher.py &
python3 news_deduper.py &

cd ../news_topic_modeling_service/trainer
python3 news_cnn_model.py &

cd ../../news_topic_modeling_service/server
python3 server.py &

cd ../../news_recommendation_service
python3 click_log_processor.py &
python3 news_recommendation_service.py &

cd ../backend_server
python3 service.py &

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)