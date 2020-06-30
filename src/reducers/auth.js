import {
    AUTH_USER,
    UNAUTH_USER,
    GET_SURVEY,
    GET_CSV,
    GET_SCORE,
    UPDATE_SCORE

} from '../constants/ActionTypes';

const initialState = {
    isLogin:false,
    data:[],
    CSV:[],
    scores:[]


};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_SCORE:
            const  newData=[]
            action.data.map((row,index) => {
                state.scores[row.no] = row.score
            })
             return { ...state, scores: this.state.scores}
        case GET_SCORE:
            return { ...state, scores: action.score}
        case GET_CSV:
            return { ...state, CSV: action.data}
        case GET_SURVEY:
            return { ...state, data: action.data}
        case AUTH_USER:
            return { ...state, isLogin: action.isLogin}
        case UNAUTH_USER:
            return { ...state, currentUser: null, isLogin: false, role:"Customer" }
        default:
            return state
    }
}