export interface Task {
    title: string;
    content: string;
    deadline: Date;
    parent: string;
    complete: boolean;
    new?: boolean;
}
