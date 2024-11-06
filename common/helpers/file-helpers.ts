export class FileHelpers {
  static generatePath(path: string) {
    const host = process.env.HOST + ':' + process.env.PORT;
    return path ? `${host}/${path}` : path; 
  }
}
