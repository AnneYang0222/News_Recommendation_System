import os
import sys

from newspaper import Article

#import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient 

DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://jdgwwllh:l1SZBgJjuY0ntfOh-AbizUKqjfNZ84V6@donkey.rmq.cloudamqp.com/jdgwwllh"
DEDUPE_NEWS_TASK_QUEUE_NAME = "dedupe-news-scrape-news-task-queue"
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://eukvhrix:VbrLL8KN6ylCxZZMCN64ROnZusTSo3pG@donkey.rmq.cloudamqp.com/eukvhrix"
SCRAPE_NEWS_TASK_QUEUE_NAME = "tap-news-scrape-news-task-queue"

SLEEP_TIME_IN_SECONDS = 5

dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print('message is broken')
        return
    
    task = msg
    text = None

    article = Article(task['url'])
    article.download()
    article.parse()
    task['text'] = article.text

    dedupe_news_queue_client.sendMessage(task)

while True:
    if scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            #Parse and process the task
            try:
                handle_message(msg)
            except Exception as e:
                print(e)
                pass
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)