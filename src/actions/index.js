import * as types from '../constants/ActionTypes'
import axios from 'axios';
import { BASIC_URL } from '../config/config';
import { object } from '@storybook/addon-knobs';
// axios.defaults.baseURL = BASIC_URL;

const questions = ["You live in a home:",
                    "Your house is built with:",
                    "The floor of your home is:",
                    "The roof of your home is:",
                    "Your bathroom is:",
                    "Water they consume is:",
                    "Cooking uses:",
                    "Home has:",
                    "Vos or any of the people living in your house have any of these symptoms?",
                    "Any person living in your home suffers from a disability?",
                    "What the person is engaged with the main source of income from your home?",
                    "Are they all in IPS?",
                    "Due to the situation created by the corona virus. Your Business:",
                    "How your business will face this situation?",
                    "Do you expect IPS?",
                    "You think you can lose your job for the coronavirus?",
                    "Once you finish the quarantine. Will you still going to your workplace?",
                    "Do you expect IPS?",
                    "You think you can lose your job for the coronavirus?",
                    "Once you finish the quarantine. Will you still going to your workplace?",
                    "Are you:",
                    "Do they have there with all instruments necessary biosafety? (Gloves, dust mask, gown, etc.)",
                    "Is there any suspected case of coronavirus in your medical center?" ,
                    "How long have become unemployed?",
                    "You can produce their own food?"]

export const login = (data) => dispatch => {
    console.log(data)
    axios
        .post(BASIC_URL + "/login", data)
        .then(res => {
            if(res.data.success === true) {
                localStorage.setItem("isLogin", true);
                dispatch({
                    type: types.AUTH_USER,
                    isLogin:res.data.success
                })
                window.location = '/admin'

            } else {
                localStorage.setItem("isLogin", false);
                dispatch({
                    type: types.AUTH_USER,
                    isLogin:res.data.success

                })              
            }
        })
        .catch(err => console.log(err));
}

export const getCSV = () => dispatch => {
    axios
        .post("/exportCSV")
        .then(res => {
                dispatch({
                    type: types.GET_CSV,
                    data:res.data
                })



        })
        .catch(err => console.log(err));
}

export const updateScore = (data) => dispatch => {
    axios
        .post("/updateScore",data)
        .then(res => {
            dispatch({
                type: types.UPDATE_SCORE,
                data:data
            })
        })
        .catch(err => console.log(err));
}

export const getScore = () => dispatch => {
    axios
        .post("/getScore")
        .then(res => {
            console.log(res.data.data)
            var scores = res.data.data;
            var scoreData = [];
            scores.liveInHome.map((row,index) => {
                Object.assign(row,{question:questions[0]})
                                Object.assign(row,{key:"liveInHome"})
                scoreData.push(row);
            })
            scores.houseMaterial.map((row,index) => {
                Object.assign(row,{question:questions[1]})
                                Object.assign(row,{key:"houseMaterial"})
                scoreData.push(row);
            })
            scores.floor.map((row,index) => {
                Object.assign(row,{question:questions[2]})
                                Object.assign(row,{key:"floor"})
                scoreData.push(row);
            })
            scores.roof.map((row,index) => {
                Object.assign(row,{question:questions[3]})
                                Object.assign(row,{key:"roof"})
                scoreData.push(row);

            })
            scores.bathroom.map((row,index) => {
                Object.assign(row,{question:questions[4]})
                                Object.assign(row,{key:"bathroom"})
                scoreData.push(row);
      
            })
            scores.water.map((row,index) => {
                Object.assign(row,{question:questions[5]})
                                Object.assign(row,{key:"water"})
                scoreData.push(row);
            
            })
            scores.cooking.map((row,index) => {
                Object.assign(row,{question:questions[6]})
                                Object.assign(row,{key:"cooking"})
                scoreData.push(row);

            })
            scores.asset.map((row,index) => {
                Object.assign(row,{question:questions[7]})
                                Object.assign(row,{key:"asset"})
                scoreData.push(row);
                    
            })
            scores.symptomsType.map((row,index) => {
                Object.assign(row,{question:questions[8]})
                                Object.assign(row,{key:"symptomsType"})
                scoreData.push(row);
                    
            })
            scores.suffering.map((row,index) => {
                Object.assign(row,{question:questions[9]})
                                Object.assign(row,{key:"suffering"})
                scoreData.push(row);
                    
            })
            scores.mainSourceIncome.map((row,index) => {
                Object.assign(row,{question:questions[10]})
                                Object.assign(row,{key:"mainSourceIncome"})
                scoreData.push(row);
                    
            })
            scores.allIPS.map((row,index) => {
                Object.assign(row,{question:questions[11]})
                                Object.assign(row,{key:"allIPS"})
                scoreData.push(row);
                    
            })
            scores.businessSituation.map((row,index) => {
                Object.assign(row,{question:questions[12]})
                                Object.assign(row,{key:"businessSituation"})
                scoreData.push(row);
                    
            })
            scores.businessStrategy.map((row,index) => {
                Object.assign(row,{question:questions[13]})
                                Object.assign(row,{key:"businessStrategy"})
                scoreData.push(row);
                    
            })
            scores.expectIPSHeadingCompany.map((row,index) => {
                Object.assign(row,{question:questions[14]})
                                Object.assign(row,{key:"expectIPSHeadingCompany"})
                scoreData.push(row);
                    
            })
            scores.loseJobHeadingCompany.map((row,index) => {
                Object.assign(row,{question:questions[15]})
                                Object.assign(row,{key:"loseJobHeadingCompany"})
                scoreData.push(row);
                    
            })
            scores.workplaceHeadingCompany.map((row,index) => {
                Object.assign(row,{question:questions[16]})
                                Object.assign(row,{key:"workplaceHeadingCompany"})
                scoreData.push(row);
                    
            })
            scores.expectIPSWhatCategoryDoes.map((row,index) => {
                Object.assign(row,{question:questions[17]})
                                Object.assign(row,{key:"expectIPSWhatCategoryDoes"})
                scoreData.push(row);
                    
            })
            scores.loseJobWhatCategoryDoes.map((row,index) => {
                Object.assign(row,{question:questions[18]})
                                Object.assign(row,{key:"loseJobWhatCategoryDoes"})
                scoreData.push(row);
                    
            })
            scores.workplaceWhatCategoryDoes.map((row,index) => {
                Object.assign(row,{question:questions[19]})
                                Object.assign(row,{key:"workplaceWhatCategoryDoes"})
                scoreData.push(row);
                    
            })
            scores.areYou.map((row,index) => {
                Object.assign(row,{question:questions[20]})
                                Object.assign(row,{key:"areYou"})
                scoreData.push(row);
                    
            })
            scores.instruments.map((row,index) => {
                Object.assign(row,{question:questions[21]})
                                Object.assign(row,{key:"instruments"})
                scoreData.push(row);
                    
            })
            scores.suspectedCaseMedicalCenter.map((row,index) => {
                Object.assign(row,{question:questions[22]})
                                Object.assign(row,{key:"suspectedCaseMedicalCenter"})
                scoreData.push(row);
                    
            })
            scores.unemployedPeriod.map((row,index) => {
                Object.assign(row,{question:questions[23]})
                                Object.assign(row,{key:"unemployedPeriod"})
                scoreData.push(row);
                    
            })
            scores.produceFood.map((row,index) => {
                Object.assign(row,{question:questions[24]})
                                Object.assign(row,{key:"produceFood"})
                scoreData.push(row);
                    
            })
                dispatch({
                    type: types.GET_SCORE,
                    score:scoreData
                })
        })
        .catch(err => console.log(err));
}

export const getSurveyData = () => dispatch => {
    axios
        .post("/getSurveyData")
        .then(res => {
            console.log(res)
            if(res.data.success === true) {
                var data = res.data.data;
                var symptomsTypes = '';
                var asset = '';
                var all = '';
                var diseases = '';
                data.map((row,index) => {            
                    for(let i = 0 ; i < row.symptomsType.length ; i++){
                        symptomsTypes = symptomsTypes + row.symptomsType[i] +","
                    }
                    for(let i = 0 ; i < row.asset.length ; i++){
                        asset = asset + row.asset[i] +","
                    }
                    for(let i = 0 ; i < row.houseMembersList.length ; i++){
                        var mem = row.houseMembersList[i].relation + "-" + row.houseMembersList[i].age
                        all = all + mem + ","
                    }
                    for( let i = 0 ; i < row. diseaseMembersList.length ; i++){
                        var disease = row. diseaseMembersList[i].relation + "-" + row. diseaseMembersList[i].age +"-"+ row. diseaseMembersList[i].disease 
                        diseases = diseases + disease + ","
                    }
                    Object.assign(row,{symptomsTypes:symptomsTypes})
                    Object.assign(row,{assets:asset})
                    Object.assign(row,{houseMembersLists:all})
                    Object.assign(row,{diseaseMembersLists:diseases})
                })
                dispatch({
                    type: types.GET_SURVEY,
                    data:data
                })

            } else {                
                // dispatch({
                //     type: types.AUTH_USER,
                //     isLogin:res.data.success

                // })              
            }
        })
        .catch(err => console.log(err));
}




export function logout() {
    return function (dispatch) {
        localStorage.setItem("isLogin",false);
        dispatch({type:types.AUTH_USER,isLogin:false})
        window.location = '/'

    }
}








