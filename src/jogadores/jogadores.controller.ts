import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Observable } from 'rxjs';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService
    ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post('')
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', criarJogadorDto.categoria)
      .toPromise();

    if (categoria) {
      this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    } else {
      throw new BadRequestException('Categoria não existe.');
    }
  }
  @Get('')
  consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', atualizarJogadorDto.categoria)
      .toPromise();

    if (categoria) {
      await this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    } else {
      throw new BadRequestException('Categoria não cadastrada!');
    }
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    await this.clientAdminBackend.emit('deletar-jogador', { _id });
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('_id') _id: string) {

    //verificar se o jogador está cadastrado
    const jogador = await this.clientAdminBackend.send('consultar-jogadores', _id).toPromise()
    if(!jogador) {
      throw new BadRequestException(`Jogador não encontrado!`)
    }

    //Enviar o arquivo para o s3 e recuperar a url de acesso
    const urlFotoJogador = await this.awsService.uploadArquivo(file, _id)

    //Atualizar o atributo url da entidade jogador
    const atualizarJogadorDto: AtualizarJogadorDto = {}
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url

    await this.clientAdminBackend.emit('atualizar-jogador', {id: _id, jogador: atualizarJogadorDto})

    //Retornar o jogador atualizado para o cliente
    return this.clientAdminBackend.send('consultar-jogadores', _id)
  }
}
