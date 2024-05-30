import { IsBoolean, IsIn, IsNumber, IsString, Length } from 'class-validator';
import { Categories } from 'src/common/category';

export class ProductDTO {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsBoolean()
  isNew: boolean;

  @IsString()
  // TODO: Revisar si se debe guardar un string o un json
  @Length(3, 1000)
  description: string;

  @IsIn(Categories)
  category: string;

  @IsString({ each: true })
  characteristics: string[];
}
