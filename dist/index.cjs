"use strict";var V=Object.create;var P=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames;var G=Object.getPrototypeOf,U=Object.prototype.hasOwnProperty;var Z=(n,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of q(e))!U.call(n,s)&&s!==r&&P(n,s,{get:()=>e[s],enumerable:!(a=k(e,s))||a.enumerable});return n};var F=(n,e,r)=>(r=n!=null?V(G(n)):{},Z(e||!n||!n.__esModule?P(r,"default",{value:n,enumerable:!0}):r,n));Object.defineProperty(exports,"__esModule",{value:!0});var $=require("es-main"),z=require("commander"),w=require("semver"),B=require("fast-xml-parser"),I=typeof document<"u"?document.currentScript:null,K="legaldac",Y="0.1.0",H="LEGAL-DAC (Programming Language)",J={build:"tsc --noEmit && rollup --config rollup.config.ts --configPlugin @rollup/plugin-typescript"},Q="dist/index.mjs",ee="dist/index.mjs",te="https://github.com/customautosys/legaldac",re="Wilson Foo Yu Kang",ne="NPOSL-3.0",ae="yarn@4.3.1",ie={commander:"^12.1.0","es-main":"^1.3.0","fast-xml-parser":"^4.4.0","libarchive.js":"^2.0.2",semver:"^7.6.2"},se={"@rollup/plugin-json":"^6.1.0","@rollup/plugin-node-resolve":"^15.2.3","@rollup/plugin-typescript":"^11.1.6","@types/node":"^20.14.9","@types/semver":"^7",esbuild:"^0.23.0",rollup:"^4.18.0","rollup-plugin-dts":"^6.1.1","rollup-plugin-esbuild":"^6.1.1",tslib:"^2.6.3",typescript:"^5.5.2"},le="module",oe={import:"./dist/index.mjs",require:"./dist/index.cjs",types:"./dist/index.d.ts"},j={name:K,version:Y,description:H,scripts:J,main:Q,bin:ee,repository:te,author:re,license:ne,packageManager:ae,dependencies:ie,devDependencies:se,type:le,exports:oe};function C(){new z.Command().version(j.version).name("legaldac").option("-d, --debug","enables verbose logging",!1).option("-v, --verbose","enables verbose logging",!1).argument("<input-filename>","the input filename").parse(process.argv)}class M{constructor(e){this.archiveFiles=e}getClauseIdentifier(e){let r="";if(typeof e.id!="string"&&(r+=`
Clause reference tag id must be a string`),w.validRange(e.version)||(r+=`
Clause reference tag id `+String(e.id)+" does not have a version attribute in the format [^]<number>.<number>.<number> or other valid semver range format"),r)throw new Error("Errors:"+r);let a=Object.keys(this.archiveFiles).filter(t=>t.startsWith(e.id+"@")&&!(this.archiveFiles[t]instanceof File));if(a.length<=0)throw new Error("No clause folders matching id "+e.id);a.sort((t,l)=>w.compare(t.split("@")[1],l.split("@")[1]));let s="";for(let t=a.length;--t>=0;)w.satisfies(a[t].split("@")[1],e.version)&&(s=a[t]);return s}async getClauseData(e){let r="",a=this.getClauseIdentifier(e);if(!a)throw new Error("No clause folders for "+e.id+" satisfying version "+e.version);let s=Object.keys(this.archiveFiles[a]).filter(i=>i.toLowerCase().endsWith(".lcxs"));if(s.length<1)throw new Error("No LCXS LEGAL-DAC Clause XML Script found");if(s.length>1)throw new Error("More than 1 LCXS LEGAL-DAC Clause XML Script found when only 1 is allowed");let t=null;this.archiveFiles[a][s[0]]instanceof File?t=this.archiveFiles[a][s[0]]:r+=`
Invalid file `+s[0];let l=Object.keys(this.archiveFiles[a]).filter(i=>i.toLowerCase().endsWith(".ts")||i.toLowerCase().endsWith(".js"));for(let i=l.length;--i>=0;)this.archiveFiles[a][l[i]]instanceof File||(r+=`
Invalid file `+l[i],l.splice(i,1));let u=await Promise.allSettled([...t?[t.text()]:[],...l.map(i=>this.archiveFiles[i].text())]);if(u.filter(i=>i.status==="rejected").forEach(i=>r+=`
`+i.status),r)throw new Error("Errors:"+r);return{identifier:a,xml:u[0].value,scripts:Object.fromEntries(u.slice(1).map((i,o)=>[l[o],i.value]))}}}var ue=Object.defineProperty,pe=(n,e,r)=>e in n?ue(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r,v=(n,e,r)=>pe(n,typeof e!="symbol"?e+"":e,r);const D=class _{constructor(){v(this,"parsedXml",[]),v(this,"version",""),v(this,"clauseReferences",[]),v(this,"clauseDatas",[]),v(this,"inputParameters",[]),v(this,"outputReturns",[])}async parse(e,r,a){let s="",t="",l=_.xmlParser.parse(e),u=l.filter(f=>f[a]);if(u.length<1)throw new Error("No root "+a+" tag");u.length>1&&(t+=`
More than 1 root `+a+" tag found when only 1 is allowed, only parsing 1st "+a+" tag");let i=String(u[0][":@"]?.version);w.valid(i)||(t+=`
All root `+a+" tags must have a version attribute in the format <number>.<number>.<number>");let o=String(u[0][":@"]?.legaldacversion);w.valid(o)||(t+=`
All root `+a+" tags must have a legaldacversion attribute in the format <number>.<number>.<number>"),w.gt(o,j.version)&&(t+=`
legaldacversion is newer than this version of LEGAL-DAC`);let g=u[0].document,d=g.filter(f=>f.clauses);d.length>1&&(t+="More than 1 clauses tag found under root "+a+" tag when at most 1 is allowed, only parsing 1st clauses tag");let L=[],y={};if(d.length>=1){let f=d[0].clauses.filter(p=>p.clause);(await Promise.allSettled(f.map(async p=>{let h={id:p[":@"]?.id,version:String(p[":@"]?.version)};return{clauseData:await r.getClauseData(h),clauseReference:h}}))).forEach(p=>{if(p.status==="fulfilled"){y[p.value.clauseData.identifier]=p.value.clauseData,L.push(p.value.clauseReference);return}s+=`
`+p.reason})}let c=[],b=null,O=g.filter(f=>f.generation);if(O.length<1&&(s+=`
No generation tag found`),O.length>1&&(t+=`
More than 1 generation tag found when only 1 is allowed, only parsing 1st generation tag`),O.length>=1){let f=O[0].generation.filter(p=>p.input);if(f.length>1&&(t+=`
More than 1 input tag found when at most 1 is allowed, only parsing 1st input tag`),f.length>=1){let p=f[0].input.filter(h=>h.parameter);if(p.length>=1)for(let h=0;h<p.length;++h){let m=p[h][":@"].name;if(typeof m!="string"||!m){s+=`
Invalid name of input parameter`;continue}if(c.findIndex(A=>A.name===m)>=0){t+=`
Duplicate input parameter `+m+", ignoring duplicates after 1st parameter tag";continue}let W="string";p[h][":@"].type==="number"||p[h][":@"].type==="boolean"?p[h][":@"].type="string":p[h][":@"].type!=="string"&&(t=`
Invalid type of input parameter `+m+", defaulting to string");let X=p[h].parameter.filter(A=>A["#text"]).map(A=>A["#text"]).join(" ");(typeof X!="string"||!X)&&(t+="Invalid prompt of input parameter "+m+", setting prompt to name",X=m),c.push({name:m,type:W,prompt:X})}}b=await this.parseOutput(O,l,c,r),s+=String(b.errors),t+=String(b.warnings)}if(b||(s+=`
No parsed output section`),s)throw new Error("Errors:"+s+`

Warnings:`+t);if(this.parsedXml=l,this.version=i,this.clauseReferences=L,this.inputParameters=c,b&&(this.outputReturns=b.outputReturns,this.setParseOutputReturn&&this.setParseOutputReturn(b)),t)return"Warnings:"+t}};v(D,"XML_PARSER_OPTIONS",{alwaysCreateTextNode:!0,preserveOrder:!0,ignoreAttributes:!1,allowBooleanAttributes:!0,processEntities:!0,htmlEntities:!0}),v(D,"xmlParser",new B.XMLParser(D.XML_PARSER_OPTIONS));let S=D;class N extends S{async parse(e,r){return super.parse(e,r,"clause")}async parseOutput(e,r,a,s){let t="",l="",u=[],i=e[0].generation.filter(g=>g.output);if(i.length<1&&(t+=`
No output tag found`),t)return{errors:t,warnings:l,outputReturns:u};i.length>1&&(l+=`
More than 1 output tag found when only 1 is allowed, only parsing 1st output tag`);let o=i[0].output.filter(g=>g.return);return o.length>2&&(t+=`
More than 2 return tags found when only either 1 or 2 are allowed`),o.length<1&&(t+=`
No return tags found`),o.length===2&&!((o[0]?.[":@"]?.type==="string"||!o[0]?.[":@"]?.type)&&o[1]?.[":@"]?.type==="OOXML"||(o[1]?.[":@"]?.type==="string"||!o[1]?.[":@"]?.type)&&o[0]?.[":@"]?.type==="OOXML")&&(t+=`
If there are 2 return tags in a clause, exactly 1 must have the type of string and 1 must have the type of OOXML`),o.length===1&&(o[0]?.[":@"]?.type!=="string"||!o[0]?.[":@"]?.type)&&o[0]?.[":@"]?.type!=="OOXML"&&(t+=`
The return type must be either string or OOXML`),o.filter(g=>!g?.[":@"]?.variable).length>0&&(t+=`
No variable specified in return tag`),t?{errors:t,warnings:l,outputReturns:u}:(u=o.map(g=>({type:g?.[":@"]?.type==="OOXML"?"OOXML":"string",variable:g[":@"].variable})),{errors:t,warnings:l,outputReturns:u})}}var ce=Object.defineProperty,ge=(n,e,r)=>e in n?ce(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r,x=(n,e,r)=>ge(n,typeof e!="symbol"?e+"":e,r);class E extends S{constructor(){super(...arguments),x(this,"outputDocumentTag",{type:"constant",value:""}),x(this,"returnAllInputs",!0),x(this,"returnAllVariables",!0)}async parse(e,r){return super.parse(e,r,"document")}async parseOutput(e,r,a,s){let t="",l="",u=[],i=e[0].generation.filter(c=>c.output);if(i.length<1&&(t+=`
No output tag found`),t)return{errors:t,warnings:l,outputReturns:u};i.length>1&&(l+=`
More than 1 output tag found when only 1 is allowed, only parsing 1st output tag`);let o=i[0]?.[":@"]?.returnAllInputs!=="false",g=i[0]?.[":@"]?.returnAllVariables!=="false",d=i[0].output.filter(c=>c.document);if(d.length<1&&(t+=`
No document tag found`),d.length>1&&(l+=`
More than 1 document tag found when only 1 is allowed, only parsing 1st document tag`),t)return{errors:t,warnings:l,outputReturns:u,returnAllInputs:o,returnAllVariables:g};if((!d[0]?.[":@"]?.constant&&d[0]?.[":@"]?.variable||String(d[0]?.[":@"]?.constant).toLowerCase().endsWith(".docx")&&!d[0]?.[":@"]?.variable)&&(t+=`
Document tag must either have a constant attribute which ends in .docx, or a variable attribute`),t)return{errors:t,warnings:l,outputReturns:u,returnAllInputs:o,returnAllVariables:g};let L={type:d[0]?.[":@"]?.variable?"variable":"constant",value:d[0]?.[":@"]?.variable?d[0][":@"].variable:d[0]?.[":@"]?.constant},y=i[0].output.filter(c=>c.return);return!o&&!g&&y.length<1&&(l+=`
No return tags found and neither returning all inputs nor returning all variables, nothing will be replaced`),y.filter(c=>c?.[":@"]?.type&&c?.[":@"]?.type!=="string"&&y[0]?.[":@"]?.type!=="OOXML")&&(t+=`
The return type must be either string or OOXML`),y.filter(c=>!c?.[":@"]?.variable).length>0&&(t+=`
No variable specified in return tag`),t?{errors:t,warnings:l,outputReturns:u,outputDocumentTag:L,returnAllInputs:o,returnAllVariables:g}:(u=y.map(c=>({type:c?.[":@"]?.type==="OOXML"?"OOXML":"string",variable:c[":@"].variable,...c?.[":@"]?.replace?{replace:c?.[":@"]?.replace}:{}})),{errors:t,warnings:l,outputReturns:u,outputDocumentTag:L,returnAllInputs:o,returnAllVariables:g})}setParseOutputReturn(e){e&&(this.outputReturns=e.outputReturns,e.outputDocumentTag&&(this.outputDocumentTag=e.outputDocumentTag),this.returnAllInputs=e.returnAllInputs!==!1,this.returnAllVariables=e.returnAllVariables!==!1)}}var de=Object.defineProperty,he=(n,e,r)=>e in n?de(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r,R=(n,e,r)=>he(n,typeof e!="symbol"?e+"":e,r);class T{constructor(){R(this,"file",null),R(this,"archive",null),R(this,"archiveFiles",null),R(this,"ldxs",null)}async load(e){this.file=e;let r=await(await(typeof window>"u"?import("libarchive.js/dist/libarchive-node.mjs"):import("libarchive.js"))).Archive.open(e),a=await r.extractFiles(),s=Object.keys(a).filter(u=>u.toLowerCase().endsWith(".ldxs")&&a[u]instanceof File);if(s.length<1)throw new Error("No LDXS LEGAL-DAC Document XML Script found");if(s.length>1)throw new Error("More than 1 LDXS LEGAL-DAC Document XML Script found when only 1 is allowed");let t=new E,l=a[s[0]];await t.parse(await l.text(),new M(a)),this.file=e,this.archive=r,this.archiveFiles=a,this.ldxs=t}}var fe=Object.freeze({__proto__:null,ArchiveFolderClauseRepository:M,LegaldacClauseXmlScript:N,LegaldacDocument7Z:T,LegaldacDocumentXmlScript:E,LegaldacXmlScript:S,cli:C});$({url:typeof document>"u"?require("url").pathToFileURL(__filename).href:I&&I.src||new URL("index.cjs",document.baseURI).href})&&C(),exports.ArchiveFolderClauseRepository=M,exports.LegaldacClauseXmlScript=N,exports.LegaldacDocument7Z=T,exports.LegaldacDocumentXmlScript=E,exports.LegaldacXmlScript=S,exports.cli=C,exports.default=fe;
//# sourceMappingURL=index.cjs.map