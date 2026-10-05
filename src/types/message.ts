export type TMessage = {
    sender: string;
    message: string;
    action: 'connection' | 'message';
}