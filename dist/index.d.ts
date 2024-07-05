import { X2jOptions, XMLParser } from 'fast-xml-parser';
import { ArchiveReader } from 'libarchive.js/dist/build/compiled/archive-reader';

declare function cli(): void;

interface ArchiveFolder {
    [key: string]: ArchiveFolder | File;
}

interface ClauseReference {
    id: string;
    version: string;
}

interface ClauseData {
    identifier: string;
    xml: string;
    scripts: {
        [key: string]: string;
    };
}

interface ClauseRepository {
    getClauseIdentifier(clauseReference: ClauseReference): string | Promise<string>;
    getClauseData(clauseReference: ClauseReference): ClauseData | Promise<ClauseData>;
}

declare class ArchiveFolderClauseRepository implements ClauseRepository {
    protected archiveFiles: ArchiveFolder;
    constructor(archiveFiles: ArchiveFolder);
    getClauseIdentifier(clauseReference: ClauseReference): string;
    getClauseData(clauseReference: ClauseReference): Promise<ClauseData>;
}

type PreserveOrderXmlNode = {
    ':@': {
        [key: string]: string;
    };
    '#text': string;
} & {
    [key: string]: PreserveOrderXmlNode[];
};

interface InputParameter {
    name: string;
    type: 'number' | 'string' | 'boolean';
    prompt: string;
}

interface OutputReturn {
    variable: string;
    type: 'string' | 'OOXML';
}

interface OutputDocumentTag {
    type: 'constant' | 'variable';
    value: string;
}

interface ParseOutputReturn {
    outputReturns: OutputReturn[];
    outputDocumentTag?: OutputDocumentTag;
    returnAllInputs?: boolean;
    returnAllVariables?: boolean;
    errors: string;
    warnings: string;
}

declare abstract class LegaldacXmlScript {
    protected static readonly XML_PARSER_OPTIONS: X2jOptions;
    protected static readonly xmlParser: XMLParser;
    protected parsedXml: PreserveOrderXmlNode[];
    protected version: string;
    protected clauseReferences: ClauseReference[];
    protected clauseDatas: ClauseData[];
    protected inputParameters: InputParameter[];
    protected outputReturns: OutputReturn[];
    parse(xml: string, clauseRepository: ClauseRepository, rootNodeName: string): Promise<string | undefined>;
    abstract parseOutput(generationNodes: PreserveOrderXmlNode[], parsedXml: PreserveOrderXmlNode[], inputParameters: InputParameter[], clauseRepository: ClauseRepository): Promise<ParseOutputReturn> | ParseOutputReturn;
    setParseOutputReturn?(parseOutputReturn: ParseOutputReturn): any;
}

declare class LegaldacClauseXmlScript extends LegaldacXmlScript {
    parse(xml: string, clauseRepository: ClauseRepository): Promise<string | undefined>;
    parseOutput(generationNodes: PreserveOrderXmlNode[], parsedXml: PreserveOrderXmlNode[], inputParameters: InputParameter[], clauseRepository: ClauseRepository): Promise<{
        errors: string;
        warnings: string;
        outputReturns: OutputReturn[];
    }>;
}

interface DocumentOutputReturn extends OutputReturn {
    replace?: string;
}

declare class LegaldacDocumentXmlScript extends LegaldacXmlScript {
    protected outputReturns: DocumentOutputReturn[];
    outputDocumentTag: OutputDocumentTag;
    returnAllInputs: boolean;
    returnAllVariables: boolean;
    parse(xml: string, clauseRepository: ClauseRepository): Promise<string | undefined>;
    parseOutput(generationNodes: PreserveOrderXmlNode[], parsedXml: PreserveOrderXmlNode[], inputParameters: InputParameter[], clauseRepository: ClauseRepository): Promise<{
        errors: string;
        warnings: string;
        outputReturns: DocumentOutputReturn[];
        returnAllInputs?: undefined;
        returnAllVariables?: undefined;
        outputDocumentTag?: undefined;
    } | {
        errors: string;
        warnings: string;
        outputReturns: DocumentOutputReturn[];
        returnAllInputs: boolean;
        returnAllVariables: boolean;
        outputDocumentTag?: undefined;
    } | {
        errors: string;
        warnings: string;
        outputReturns: DocumentOutputReturn[];
        outputDocumentTag: OutputDocumentTag;
        returnAllInputs: boolean;
        returnAllVariables: boolean;
    }>;
    setParseOutputReturn(parseOutputReturn: ParseOutputReturn): void;
}

declare class LegaldacDocument7Z {
    protected file: File | null;
    protected archive: ArchiveReader | null;
    protected archiveFiles: ArchiveFolder | null;
    protected ldxs: LegaldacDocumentXmlScript | null;
    load(file: File): Promise<void>;
}

interface Statement {
    execute(): void;
}

type exports_ArchiveFolder = ArchiveFolder;
type exports_ArchiveFolderClauseRepository = ArchiveFolderClauseRepository;
declare const exports_ArchiveFolderClauseRepository: typeof ArchiveFolderClauseRepository;
type exports_ClauseData = ClauseData;
type exports_ClauseReference = ClauseReference;
type exports_ClauseRepository = ClauseRepository;
type exports_DocumentOutputReturn = DocumentOutputReturn;
type exports_InputParameter = InputParameter;
type exports_LegaldacClauseXmlScript = LegaldacClauseXmlScript;
declare const exports_LegaldacClauseXmlScript: typeof LegaldacClauseXmlScript;
type exports_LegaldacDocument7Z = LegaldacDocument7Z;
declare const exports_LegaldacDocument7Z: typeof LegaldacDocument7Z;
type exports_LegaldacDocumentXmlScript = LegaldacDocumentXmlScript;
declare const exports_LegaldacDocumentXmlScript: typeof LegaldacDocumentXmlScript;
type exports_LegaldacXmlScript = LegaldacXmlScript;
declare const exports_LegaldacXmlScript: typeof LegaldacXmlScript;
type exports_OutputDocumentTag = OutputDocumentTag;
type exports_OutputReturn = OutputReturn;
type exports_ParseOutputReturn = ParseOutputReturn;
type exports_PreserveOrderXmlNode = PreserveOrderXmlNode;
type exports_Statement = Statement;
declare const exports_cli: typeof cli;
declare namespace exports {
  export { type exports_ArchiveFolder as ArchiveFolder, exports_ArchiveFolderClauseRepository as ArchiveFolderClauseRepository, type exports_ClauseData as ClauseData, type exports_ClauseReference as ClauseReference, type exports_ClauseRepository as ClauseRepository, type exports_DocumentOutputReturn as DocumentOutputReturn, type exports_InputParameter as InputParameter, exports_LegaldacClauseXmlScript as LegaldacClauseXmlScript, exports_LegaldacDocument7Z as LegaldacDocument7Z, exports_LegaldacDocumentXmlScript as LegaldacDocumentXmlScript, exports_LegaldacXmlScript as LegaldacXmlScript, type exports_OutputDocumentTag as OutputDocumentTag, type exports_OutputReturn as OutputReturn, type exports_ParseOutputReturn as ParseOutputReturn, type exports_PreserveOrderXmlNode as PreserveOrderXmlNode, type exports_Statement as Statement, exports_cli as cli };
}

export { type ArchiveFolder, ArchiveFolderClauseRepository, type ClauseData, type ClauseReference, type ClauseRepository, type DocumentOutputReturn, type InputParameter, LegaldacClauseXmlScript, LegaldacDocument7Z, LegaldacDocumentXmlScript, LegaldacXmlScript, type OutputDocumentTag, type OutputReturn, type ParseOutputReturn, type PreserveOrderXmlNode, type Statement, cli, exports as default };
