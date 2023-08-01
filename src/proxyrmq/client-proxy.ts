import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxySmartRanking {
    getClientProxyAdminBackendInstance(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://user:0Ukvlm:PTixs@23.22.5.150:5672/smartranking'],
                queue: 'admin-backend'
              }
        })
    }
}
