package org.example.web.ethereum;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Action;
import io.reactivex.functions.Consumer;
import io.reactivex.internal.functions.ObjectHelper;
import io.reactivex.internal.subscribers.LambdaSubscriber;
import org.reactivestreams.Subscription;
import org.web3j.abi.TypeReference;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.EthLog;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.utils.Numeric;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.Address;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class AuctionEventListener {
    private static final Logger log = LoggerFactory.getLogger(AuctionEventListener.class);
    /*
        event AuctionStarted(address contractAddress, uint tokenId, address seller);
        event AuctionEnded(address contractAddress, uint tokenId, address seller);

    * */

    private static final Event AUCTION_STARTED_EVENT = new Event("AuctionStarted",
            Arrays.asList(
                    new TypeReference<Address>(true) {},  // contractAddress (indexed)
                    new TypeReference<Uint256>(false) {}, // tokenId (not indexed)
                    new TypeReference<Address>(true) {}   // seller (indexed)
            ));

    private static final Event AUCTION_ENDED_EVENT = new Event("AuctionEnded",
            Arrays.asList(
                    new TypeReference<Address>(true) {},  // contractAddress (indexed)
                    new TypeReference<Uint256>(false) {}, // tokenId (not indexed)
                    new TypeReference<Address>(true) {}   // seller (indexed)
            ));
    String auctionStartedTopic = EventEncoder.encode(AUCTION_STARTED_EVENT);
    String auctionEndedTopic = EventEncoder.encode(AUCTION_ENDED_EVENT);
    private final Web3j web3j;
    private final String contractAddress;

    public AuctionEventListener(Web3j web3j, String contractAddress) {
        this.web3j = web3j;
        this.contractAddress = contractAddress;
    }

    public void listenToAuctionEvents() {


        EthFilter filter = new EthFilter(
                DefaultBlockParameterName.LATEST,
                DefaultBlockParameterName.LATEST,
                contractAddress
        ).addOptionalTopics(auctionStartedTopic, auctionEndedTopic);

        log.info("Listening for AuctionStarted and AuctionEnded events on contract {}", contractAddress);

        try {
            EthLog logs = web3j.ethGetLogs(filter).send();
            for (EthLog.LogResult<?> logResult : logs.getLogs()) {
                Log log = (Log) logResult.get();
                System.out.println(log.toString());
            }
        } catch (IOException e) {
            log.error("Error fetching logs", e);
        }


        Disposable subscription = web3j.ethLogFlowable(filter).subscribe(event -> {
            List<String> topics = event.getTopics();
            if (topics.isEmpty()) return;

            String eventSignature = topics.get(0);
            if (eventSignature.equals(auctionStartedTopic)) {
                handleAuctionStarted(event);
            } else if (eventSignature.equals(auctionEndedTopic)) {
                handleAuctionEnded(event);
            }
        }, throwable -> log.error("Error listening to events", throwable));
    }

    private void processEvent(Log event) {
        List<String> topics = event.getTopics();
        if (topics.isEmpty()) return;

        String eventSignature = topics.get(0);
        if (eventSignature.equals(auctionStartedTopic)) {
            handleAuctionStarted(event);
        } else if (eventSignature.equals(auctionEndedTopic)) {
            handleAuctionEnded(event);
        }
    }
    private void handleAuctionStarted(Log event) {
        List<String> topics = event.getTopics();
        if (topics.size() < 3) return;

        String contractAddress = "0x" + topics.get(1).substring(26);
        String seller = "0x" + topics.get(2).substring(26);

        BigInteger tokenId = Numeric.toBigInt(event.getData()); // tokenId теперь извлекается из data

        log.info("Auction started for contract: {}, tokenId: {}, seller: {}", contractAddress, tokenId, seller);
    }

    private void handleAuctionEnded(Log event) {
        List<String> topics = event.getTopics();
        if (topics.size() < 3) return;

        String contractAddress = "0x" + topics.get(1).substring(26);
        BigInteger tokenId = Numeric.toBigInt(topics.get(2));
        String seller = "0x" + topics.get(3).substring(26);

        log.info("Auction ended for contract: {}, tokenId: {}, seller: {}", contractAddress, tokenId, seller);
    }
/*
    private <T> Disposable subscribe(Consumer<? super T> onNext, Consumer<? super Throwable> onError, Action onComplete, Consumer<? super Subscription> onSubscribe) {
        ObjectHelper.requireNonNull(onNext, "onNext is null");
        ObjectHelper.requireNonNull(onError, "onError is null");
        ObjectHelper.requireNonNull(onComplete, "onComplete is null");
        ObjectHelper.requireNonNull(onSubscribe, "onSubscribe is null");
        LambdaSubscriber<T> ls = new LambdaSubscriber(onNext, onError, onComplete, onSubscribe);
        this.subscribe(ls);
        return ls;
    }
*/}