import type ClauseReference from '../interfaces/ClauseReference';
import type ClauseRepository from '../interfaces/ClauseRepository';
import type ClauseData from '../interfaces/ClauseData';

export class DummyClauseRepository implements ClauseRepository{
	getClauseIdentifier(clauseReference:ClauseReference){
		return '';
	}

	async getClauseData(clauseReference:ClauseReference){
		return <ClauseData>{
			identifier:'',
			xml:'',
			scripts:{}
		};
	}
};

export default DummyClauseRepository;