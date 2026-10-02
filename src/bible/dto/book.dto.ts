export type Testament = 'old'| 'new'

export interface BookDto {
    id: string;
    name: string;
    order: number;
    chapters: number;
    testament: Testament;
}
