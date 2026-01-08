import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './categoria.entity';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), AuthModule],
  providers: [CategoriasService],
  controllers: [CategoriasController],
})
export class CategoriasModule {}
