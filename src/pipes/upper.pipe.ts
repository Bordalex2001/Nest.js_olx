import { PipeTransform } from "@nestjs/common";

export class UpperPipe implements PipeTransform{
    transform(value: any) {
        return value.toUpperCase();
    }
}