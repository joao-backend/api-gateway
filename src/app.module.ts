import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ProxyRMQModule} from './proxyrmq/proxyrmq.module';

@Module({
  imports: [CategoriasModule, JogadoresModule, ProxyRMQModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
