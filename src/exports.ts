import cli from './functions/cli';

import ArchiveFolderClauseRepository from './classes/ArchiveFolderClauseRepository';
import LegaldacClauseXmlScript from './classes/LegaldacClauseXmlScript';
import LegaldacDocument7Z from './classes/LegaldacDocument7Z';
import LegaldacDocumentXmlScript from './classes/LegaldacDocumentXmlScript';
import LegaldacXmlScript from './classes/LegaldacXmlScript';

import type ArchiveFolder from './interfaces/ArchiveFolder';
import type ClauseData from './interfaces/ClauseData';
import type ClauseReference from './interfaces/ClauseReference';
import type ClauseRepository from './interfaces/ClauseRepository';
import type DocumentOutputReturn from './interfaces/DocumentOutputReturn';
import type InputParameter from './interfaces/InputParameter';
import type OutputDocumentTag from './interfaces/OutputDocumentTag';
import type OutputReturn from './interfaces/OutputReturn';
import type ParseOutputReturn from './interfaces/ParseOutputReturn';
import type PreserveOrderXmlNode from './interfaces/PreserveOrderXmlNode';
import type Statement from './interfaces/Statement';

export{
	cli,
	ArchiveFolderClauseRepository,
	ArchiveFolder,
	ClauseData,
	ClauseReference,
	ClauseRepository,
	DocumentOutputReturn,
	InputParameter,
	LegaldacClauseXmlScript,
	LegaldacDocument7Z,
	LegaldacDocumentXmlScript,
	LegaldacXmlScript,
	OutputDocumentTag,
	OutputReturn,
	ParseOutputReturn,
	PreserveOrderXmlNode,
	Statement
};