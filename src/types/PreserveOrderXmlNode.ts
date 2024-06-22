export type PreserveOrderXmlNode={
	':@':{
		[key:string]:string
	},
	'#text':string
}&{
	[key:string]:PreserveOrderXmlNode[]
};

export default PreserveOrderXmlNode;