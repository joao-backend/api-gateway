import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [CategoriasModule, JogadoresModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
