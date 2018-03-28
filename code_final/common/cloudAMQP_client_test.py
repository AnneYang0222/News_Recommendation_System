from cloudAMQP_client import CloudAMQPClient 
CLOUDAMQP_URL ="amqp://qcrxsnod:hILVt5-sr68NSwLcqGR_1hwlYfBOHfUp@donkey.rmq.cloudamqp.com/qcrxsnod"
TEST_QUEUE_NAME = "test"

def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)


    sentMsg = {"test": "test"}
    client.sendMessage(sentMsg)
    receivedMsg = client.getMessage()

    assert sentMsg == receivedMsg
    print("test_basic passed!!")

if __name__=="__main__":
    test_basic()