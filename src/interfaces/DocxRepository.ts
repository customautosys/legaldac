export interface DocxRepository{
	getDocx(name:string):Promise<ArrayBuffer>|ArrayBuffer;
};

export default DocxRepository;