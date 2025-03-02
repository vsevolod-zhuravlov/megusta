package org.example.web.ethereum;


import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.http.HttpService;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.websocket.WebSocketService;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/*
public class EthereumService {
    private static final String WS_URL = "wss://ethereum-sepolia-rpc.publicnode.com";


    public static void main(String[] args) {
        try {
            WebSocketService wsService = new WebSocketService(WS_URL, true);
            wsService.connect();


            Thread.sleep(5000);
            Web3j web3 = Web3j.build(wsService);

            String contractAddress = "0xB657c8429eA14CF054f802c211F5958C7285136D";

            AuctionEventListener eventListener = new AuctionEventListener(web3, contractAddress);
            eventListener.listenToAuctionEvents();

            // Keep the program running
            Thread.sleep(Long.MAX_VALUE);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }


    /*
    public static void getCoursesOfTeacher(Web3j web3, String teacherAddress) throws IOException {
        Function function = new Function(
                "getCoursesOfTeacher",
                Arrays.asList(new Address(teacherAddress)),  // Input args
                Arrays.asList(new org.web3j.abi.TypeReference<DynamicArray<Address>>() {
                }) // Return type: address[]
        );

        String encodedFunction = FunctionEncoder.encode(function);
        Transaction tx = Transaction.createEthCallTransaction(null, CONTRACT_ADDRESS, encodedFunction);
        EthCall response = web3.ethCall(tx, DefaultBlockParameterName.LATEST).send();

        // Decode the response
        List<Type> decoded = FunctionReturnDecoder.decode(response.getValue(), function.getOutputParameters());
        List<Address> courses = ((DynamicArray<Address>) decoded.get(0)).getValue();

        // Print courses
        System.out.println("Courses of teacher " + teacherAddress + ":");
        for (Address course : courses) {
            System.out.println("- " + course.toString());
        }
    }

    public static void getCourseByIndex(Web3j web3, String teacherAddress, int index) throws IOException {
        Function function = new Function(
                "getCourseByIndex",
                Arrays.asList(new Address(teacherAddress), new Uint256(index)), // Input args
                Arrays.asList(new org.web3j.abi.TypeReference<Address>() {
                }) // Return type: address
        );

        String encodedFunction = FunctionEncoder.encode(function);
        Transaction tx = Transaction.createEthCallTransaction(null, CONTRACT_ADDRESS, encodedFunction);
        EthCall response = web3.ethCall(tx, DefaultBlockParameterName.LATEST).send();

        // Decode the response
        List<Type> decoded = FunctionReturnDecoder.decode(response.getValue(), function.getOutputParameters());
        Address course = (Address) decoded.get(0);

        // Print course
        System.out.println("Course at index " + index + " for teacher " + teacherAddress + ": " + course.toString());
    }

}*/
