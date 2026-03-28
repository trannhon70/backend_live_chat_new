import { forwardRef, Global, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
// import { ChatGateway } from './gateway/chat.gateway';

@Global()
@Module({
    imports: [
        // forwardRef(() => MessageModule),
    ], // 👈 để ChatGateway dùng MessageService 
    providers: [SocketService, SocketGateway],
    exports: [SocketService, SocketGateway], // 👈 export để middleware hoặc service khác dùng
})
export class SocketModule { }
