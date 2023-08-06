import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxySmartRanking {

    constructor(){}

    getClientProxyAdminBackendInstance(): ClientProxy {


        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL],
                queue: process.env.RABBITMQ_QUEUE
              }
        })
    }
}
