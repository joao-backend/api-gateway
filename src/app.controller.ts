import { Body, Controller, Post, Logger, UsePipes, ValidationPipe, Query, Get, Put, Param } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CriarCategoriaDto } from './categorias/dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './categorias/dtos/atualizar-categoria.dto';

@Controller('')
export class AppController {

}
