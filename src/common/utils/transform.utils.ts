import { TransbankEnum } from '../enums/transbank.enum';

export default class TransformUtils {
  public static readonly formattedDate = (date: string): string => {
    const meses: string[] = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const dateCast = new Date(date);

    const mes: string = meses[dateCast.getMonth()];
    const dia: number = dateCast.getDate();
    const año: number = dateCast.getFullYear();

    return `${mes}, ${dia} de ${año}`;
  };

  public static readonly formattedAmount = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  public static readonly formattedStatus = (status: string): string => {
    return TransbankEnum[status];
  };
}
