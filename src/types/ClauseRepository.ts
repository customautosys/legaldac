import type ClauseData from './ClauseData';
import type ClauseReference from './ClauseReference';

export interface ClauseRepository{
	getClauseIdentifier(clauseReference:ClauseReference):string|Promise<string>;
	getClauseData(clauseReference:ClauseReference):ClauseData|Promise<ClauseData>;
};

export default ClauseRepository;