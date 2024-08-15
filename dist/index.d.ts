import { X2jOptions, XMLParser } from 'fast-xml-parser';
import { ArchiveReader } from 'libarchive.js/dist/build/compiled/archive-reader';
import libarchive_js from 'libarchive.js';

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

interface DocxRepository {
    getDocx(name: string): Promise<ArrayBuffer> | ArrayBuffer;
}

declare class ArchiveFolderDocxRepository implements DocxRepository {
    protected archiveFiles: ArchiveFolder;
    constructor(archiveFiles: ArchiveFolder);
    getDocx(name: string): Promise<ArrayBuffer>;
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

interface ParseOutputReturn {
    outputReturns: OutputReturn[];
    errors: string;
    warnings: string;
}

interface Statement {
    execute(): void;
}

interface GenerationSection {
    locale: string;
    inputParameters: InputParameter[];
    statements: Statement[];
    outputReturns: OutputReturn[];
}

declare abstract class LegaldacXmlScript {
    protected static readonly XML_PARSER_OPTIONS: X2jOptions;
    protected static readonly xmlParser: XMLParser;
    protected parsedXml: PreserveOrderXmlNode[];
    protected version: string;
    protected legaldacVersion: string;
    protected defaultLocale: string;
    protected generationSections: GenerationSection[];
    protected parse(xml: string, clauseRepository: ClauseRepository, rootNodeName: string): Promise<string | undefined>;
    protected abstract parseOutput(generationNodes: PreserveOrderXmlNode[], parsedXml: PreserveOrderXmlNode[], inputParameters: InputParameter[], clauseRepository: ClauseRepository): Promise<ParseOutputReturn> | ParseOutputReturn;
    protected abstract createGenerationSection(locale: string, inputParameters: InputParameter[], statements: Statement[], parseOutputReturn: ParseOutputReturn): Promise<GenerationSection> | GenerationSection;
}

declare class LegaldacClauseXmlScript extends LegaldacXmlScript {
    parse(xml: string, clauseRepository: ClauseRepository): Promise<string | undefined>;
    protected parseOutput(generationNodes: PreserveOrderXmlNode[], parsedXml: PreserveOrderXmlNode[], inputParameters: InputParameter[], clauseRepository: ClauseRepository): Promise<{
        errors: string;
        warnings: string;
        outputReturns: OutputReturn[];
    }>;
    protected createGenerationSection(locale: string, inputParameters: InputParameter[], statements: Statement[], parseOutputReturn: ParseOutputReturn): GenerationSection;
}

interface DocumentOutputReturn extends OutputReturn {
    replace?: string;
}

interface OutputDocumentTag {
    type: 'constant' | 'variable';
    value: string;
}

interface DocumentParseOutputReturn extends ParseOutputReturn {
    outputDocumentTag: OutputDocumentTag;
    returnAllInputs: boolean;
    returnAllVariables: boolean;
}

interface DocumentGenerationSection extends GenerationSection {
    outputReturns: DocumentOutputReturn[];
    outputDocumentTag: OutputDocumentTag;
    returnAllInputs: boolean;
    returnAllVariables: boolean;
}

interface PromptOption {
    label?: string;
    value: string | number | boolean;
}

interface PromptQuestion {
    variable: string;
    label: string;
    options?: PromptOption[];
}

interface PromptParams {
    label?: string;
    questions?: PromptQuestion[];
}

interface PromptReturn {
    variable: string;
    value: string | number | boolean;
}

interface ExecutionInputParams {
    [key: string]: number | string | boolean;
}

declare class LegaldacDocumentXmlScript extends LegaldacXmlScript {
    protected generationSections: DocumentGenerationSection[];
    parse(xml: string, clauseRepository: ClauseRepository): Promise<string | undefined>;
    protected parseOutput(generationNodes: PreserveOrderXmlNode[], parsedXml: PreserveOrderXmlNode[], inputParameters: InputParameter[], clauseRepository: ClauseRepository): Promise<{
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
    protected createGenerationSection(locale: string, inputParameters: InputParameter[], statements: Statement[], parseOutputReturn: DocumentParseOutputReturn): DocumentGenerationSection;
    execute(docxRepository: DocxRepository, executionInputParams: ExecutionInputParams, prompt: (promptParams: PromptParams) => Promise<PromptReturn> | PromptReturn, locale?: string): Promise<Blob>;
}

declare abstract class Legaldac7Z {
    protected static libarchive: typeof libarchive_js | null;
    protected file: File | null;
    protected archive: ArchiveReader | null;
    protected archiveFiles: ArchiveFolder | null;
    load(file: File): Promise<void>;
    abstract parseArchive(archive: ArchiveReader, archiveFiles: ArchiveFolder): Promise<void> | void;
}

declare class LegaldacDocument7Z extends Legaldac7Z {
    protected ldxs: LegaldacDocumentXmlScript | null;
    parseArchive(archive: ArchiveReader, archiveFiles: ArchiveFolder): Promise<void>;
}

type exports_ArchiveFolder = ArchiveFolder;
type exports_ArchiveFolderClauseRepository = ArchiveFolderClauseRepository;
declare const exports_ArchiveFolderClauseRepository: typeof ArchiveFolderClauseRepository;
type exports_ArchiveFolderDocxRepository = ArchiveFolderDocxRepository;
declare const exports_ArchiveFolderDocxRepository: typeof ArchiveFolderDocxRepository;
type exports_ClauseData = ClauseData;
type exports_ClauseReference = ClauseReference;
type exports_ClauseRepository = ClauseRepository;
type exports_DocumentOutputReturn = DocumentOutputReturn;
type exports_DocxRepository = DocxRepository;
type exports_ExecutionInputParams = ExecutionInputParams;
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
type exports_PromptOption = PromptOption;
type exports_PromptParams = PromptParams;
type exports_PromptQuestion = PromptQuestion;
type exports_PromptReturn = PromptReturn;
type exports_Statement = Statement;
declare const exports_cli: typeof cli;
declare namespace exports {
  export { type exports_ArchiveFolder as ArchiveFolder, exports_ArchiveFolderClauseRepository as ArchiveFolderClauseRepository, exports_ArchiveFolderDocxRepository as ArchiveFolderDocxRepository, type exports_ClauseData as ClauseData, type exports_ClauseReference as ClauseReference, type exports_ClauseRepository as ClauseRepository, type exports_DocumentOutputReturn as DocumentOutputReturn, type exports_DocxRepository as DocxRepository, type exports_ExecutionInputParams as ExecutionInputParams, type exports_InputParameter as InputParameter, exports_LegaldacClauseXmlScript as LegaldacClauseXmlScript, exports_LegaldacDocument7Z as LegaldacDocument7Z, exports_LegaldacDocumentXmlScript as LegaldacDocumentXmlScript, exports_LegaldacXmlScript as LegaldacXmlScript, type exports_OutputDocumentTag as OutputDocumentTag, type exports_OutputReturn as OutputReturn, type exports_ParseOutputReturn as ParseOutputReturn, type exports_PreserveOrderXmlNode as PreserveOrderXmlNode, type exports_PromptOption as PromptOption, type exports_PromptParams as PromptParams, type exports_PromptQuestion as PromptQuestion, type exports_PromptReturn as PromptReturn, type exports_Statement as Statement, exports_cli as cli };
}

export { type ArchiveFolder, ArchiveFolderClauseRepository, ArchiveFolderDocxRepository, type ClauseData, type ClauseReference, type ClauseRepository, type DocumentOutputReturn, type DocxRepository, type ExecutionInputParams, type InputParameter, LegaldacClauseXmlScript, LegaldacDocument7Z, LegaldacDocumentXmlScript, LegaldacXmlScript, type OutputDocumentTag, type OutputReturn, type ParseOutputReturn, type PreserveOrderXmlNode, type PromptOption, type PromptParams, type PromptQuestion, type PromptReturn, type Statement, cli, exports as default };
