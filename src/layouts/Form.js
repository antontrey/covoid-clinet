import React, { useState, useReducer, useEffect } from 'react'

import Question from '../components/SelectQuestion'
import InputQuestion from '../components/InputQuestion'
import MultiInput from '../components/MultiInput'
import FormBox from '../components/FormBox'
import { useTranslation } from 'react-i18next'

import {
  Table
} from 'reactstrap';

import {
  NativeSelect,
  TextField,
} from '@material-ui/core';

import MultipleSelect from '../components/MultipleSelect'

import Select from 'react-select'

import axios from "axios";
import { BASIC_URL } from '../config/config';
import Swal from 'sweetalert2'

const Form = ({ filledState = {}, setFormState, form }) => {
  const sequence = [
    'firstName',
    'lastName',
    'idNumber',
    'gender',
    'cellPhoneNumber',
    'age',
    'neighborhood',
    'address',
    'houseMembers',
    'houseMembersList',
    'liveInHome',
    'houseMaterial',
    'floor',
    'roof',
    'bathroom',
    'water',
    'cooking',
    'asset',
    'guarani',
    'symptomsType',
    'suspectedCase',
    'suffering',
    'diseaseMembers',
    'diseaseMembersList',
    'regularVisitors',
    'mainSourceIncome',
    'workCategory',
    'employeesNumber',
    'allIPS',
    'layOffEmployees',
    'businessSituation',
    'businessStrategy',
    'amountMarchMoney',
    'amountAprilMoney',
    'headingCompany',
    'role',
    'expectIPSHeadingCompany',
    'loseJobHeadingCompany',
    'guaraniEnterHeadingCompany',
    'workplaceHeadingCompany',
    'shareWorkplaceHeadingCompany',
    'whatCategoryDoes',
    'expectIPSWhatCategoryDoes',
    'loseJobWhatCategoryDoes',
    'guaraniEnterWhatCategoryDoes',
    'workplaceWhatCategoryDoes',
    'shareWorkplaceWhatCategoryDoes',
    'areYou',
    'medicalCenterServing',
    'instruments',
    'suspectedCaseMedicalCenter',
    'unemployedPeriod',
    'produceFood',
    'surviveMoney',
    'receiveMoney',
    'spendDrugs',
    'commentMayerWorkCategory',
    'commentMayerHeadingCompany',
    'commentMayerWhatCategoryDoes',
    'commentMayerAreYou',
    'commentMayerUnemployedPeriod',
    'commentMayerReceiveMoney',
    'end'
  ]

  // takes an array of keys returns an object with keys and defaultStates
  const createDefaultStates = (list, defaultState) =>
    list.reduce((obj, item) => {
      obj[item] = defaultState
      return obj
    }, {})

  const [status, setStatus] = useReducer(
    (state, newState) => {
      return { ...state, ...newState }
    },
    {
      [sequence[0]]: { show: true, answer: '' },
      ...createDefaultStates(sequence.slice(1), { show: false, answer: '' }),
      ...filledState
    }
  )

  const [errors, setErrors] = useState(createDefaultStates(sequence, false))

  const nextQuestion = (q, ...hide) => {
    const defaultState = { show: false, answer: '' }
    const i = sequence.indexOf(q)
    const valuesToReset = createDefaultStates(sequence.slice(i), defaultState)

    // if present: hide conditional question
    hide.map(key => (valuesToReset[key] = defaultState))

    setStatus({
      ...valuesToReset,
      [q]: { show: true, answer: '' }
    })
  }

  const handleQuestion = (q, value, cbOrNextQ) => {
    if (value === null) return nextQuestion(q)

    setErrors({ ...errors, [q]: false })
    setStatus({
      [q]: { show: true, answer: value }
    })
    if (cbOrNextQ == null) return
    else if (typeof cbOrNextQ === 'function'){
      cbOrNextQ()
    } 
    else {
      nextQuestion(cbOrNextQ)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // If all fields are filled.
    if(!status.commentMayerWorkCategory.show && !status.commentMayerHeadingCompany.show && !status.commentMayerWhatCategoryDoes.show && !status.commentMayerAreYou.show && !status.commentMayerUnemployedPeriod.show && !status.commentMayerReceiveMoney.show ) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Please fill in all the fields!',
      })
      return;
    }

    var weight;
    await axios
      .post(BASIC_URL + "/getWeight")
      .then(res => {
          if(res.data.success === true) {
            weight = res.data.result;
          } else {
              console.log("While getting weights, there was occured unknown errors!");
          }
      })

    const newErrors = errors
    let errorPresent = false
    let newSurvey = {};
    let weightVal = 0;
    Object.entries(status).forEach(([key, value]) => {

      if(value.show) {

        let newKey = key;
        let newVal = value.answer;

        // //Avoiding reduplication, integrates some fields to one.
        // if(status.expectIPSHeadingCompany.show || status.expectIPSWhatCategoryDoes.show) {
        //   //Integrate two "expect IPS" to one.
        //   newKey = "expectIPS";
        // } else if(status.loseJobHeadingCompany.show || status.loseJobWhatCategoryDoes.show) {
        //   //Integrate two "lose job" to one.
        //   newKey = "loseJob";
        // } else if(status.guaraniEnterHeadingCompany.show || status.guaraniEnterHeadingCompany.show) {
        //   //Integrate two "guarani enter" to one.
        //   newKey = "guaraniEnter";
        // } else if(status.workplaceHeadingCompany.show || status.workplaceWhatCategoryDoes.show) {
        //   //Integrate two "workplace" to one.
        //   newKey = "workplace";
        // } else if(status.shareWorkplaceHeadingCompany.show || status.shareWorkplaceWhatCategoryDoes.show) {
        //   //Integrate two "shareWorkplace" to one.
        //   newKey = "shareWorkplace";
        // } else if(status.commentMayerWorkCategory.show || status.commentMayerHeadingCompany.show || status.commentMayerWhatCategoryDoes.show || status.commentMayerAreYou.show || status.commentMayerUnemployedPeriod.show || status.commentMayerReceiveMoney.show ) {
        //     //Integtrate 6 "comment mayer" to one.
        //     newKey = "commentMayer";
        // }

        newSurvey = { ...newSurvey, [newKey]: newVal}

        //Calculate the weight value.
        if(weight[key] !== undefined) {

          //if "key" is "asset" or "symptomsType", in other words multiple choice.
          // asset weight is the sum of sub-assets weight.
          if( key === "asset" || key === "symptomsType") {
            for(let i = 0 ; i < weight[key].length ; i ++) {
              for( let j = 0 ; j < value.answer.length ; j ++ ) {
                if(weight[key][i].valueEs === value.answer[j]) {
                  weightVal += parseInt(weight[key][i].weight)
                }
              }
            }
          } else {
            //On the other hands, weight is the only one of the sub-menu weights.
            for(let i = 0 ; i < weight[key].length ; i ++) {
              if(weight[key][i].valueEs === value.answer) {
                weightVal += parseInt(weight[key][i].weight)
              }
            }
          }
        }
      }

    //   if (value.show === true && value.answer === '') {
    //     newErrors[key] = true
    //     errorPresent = true
    //   } else {
    //     newErrors[key] = false
    //     // console.log(key + " : " + value.answer)
    //   }
    })

    //Add weight value to servey
    newSurvey = { ...newSurvey, "weight": '' + weightVal}
    console.log(newSurvey);

    //Save to database new survey
    await axios.post(BASIC_URL + "/surveyData", newSurvey)
      .then(res => {

          if( res.data.success === true ) {
            Swal.fire({
              icon: 'success',
              title: 'Your request was transfered successfully.',
            })
            // window.location = "/";
          } else {
            Swal.fire({
              icon: 'error',
              title: 'There was occurred unknown errors.',
            })

          }

      })

    setErrors({ ...errors, newErrors })

    // if (!errorPresent) {
      // setFormState({ ...form, ...status, progress: 1 })
    // }
  }

  const createMemberList = (value) => {
    if(value === null || value === undefined || value === 0) {
      return;
    }
    
    let oneMember = {
      relation: "",
      age: "",
      idNumber: ""
    }
    let houseMembersList = [];
    for( let i = 0 ; i < value ; i ++ ) {
      houseMembersList.push(oneMember);
    }
    setErrors({ ...errors, houseMembersList: false })
    setStatus({
      houseMembersList: { show: true, answer: houseMembersList }
    })
  }

  const changeHouseMembersList = (idx, event) => {
    
    let { name, value } = event.target;
    if( name === "relation" ) {
      let afterValue = "";
      switch(value) {
        case "selectMember":
          afterValue = "";
          break;
        case "father":
          afterValue = t('houseMembersList.options.father');
          break;
        case "mother":
          afterValue = t('houseMembersList.options.mother');
          break;
        case "partner":
          afterValue = t('houseMembersList.options.partner');
          break;
        case "child":
          afterValue = t('houseMembersList.options.child');
          break;
        case "grandpa":
          afterValue = t('houseMembersList.options.grandpa');
          break;
        case "other":
          afterValue = t('houseMembersList.options.other');
          break;
        default:
          afterValue = "";
          break;
      }

      value = afterValue;
    }

    let rows = [...status.houseMembersList.answer];
    let oneItem = rows[idx];

    rows[idx] = {
        ...oneItem,
        [name] : value
    };

    setStatus({
      houseMembersList: { show: true, answer: rows }
    })
  }

  const handleAsset = (event) => {
    let newAssets = [];
    if(event !== null) {
        event.map((item, idx) => {
        newAssets.push(item.value)
      })
    }
    setErrors({ ...errors, asset: false })
    setStatus({
      asset: { show: true, answer: newAssets }
    })
  }

  const handleSymptomsType = (event) => {
    let newSymptomsType = [];
    if(event !== null) {
        event.map((item, idx) => {
        newSymptomsType.push(item.value)
      })
    }
    setErrors({ ...errors, symptomsType: false })
    setStatus({
      symptomsType: { show: true, answer: newSymptomsType }
    })
  }

  const createDiseaseMembersList = (value) => {
    if(value === null || value === undefined || value === 0) {
      return;
    }
    
    let oneMember = {
      relation: "",
      age: "",
      disease: ""
    }
    let diseaseMembersList = [];
    for( let i = 0 ; i < value ; i ++ ) {
      diseaseMembersList.push(oneMember);
    }
    setErrors({ ...errors, diseaseMembersList: false })
    setStatus({
      diseaseMembersList: { show: true, answer: diseaseMembersList }
    })
  }

  const changeDiseaseMemberList = (idx, event) => {
    
    let { name, value } = event.target;

    if( name === "relation" || name === "disease" ) {
      let afterValue = "";
      switch(value) {
        case "selectMember":
          afterValue = "";
          break;
        case "father":
          afterValue = t('diseaseMembersList.options.father');
          break;
        case "mother":
          afterValue = t('diseaseMembersList.options.mother');
          break;
        case "partner":
          afterValue = t('diseaseMembersList.options.partner');
          break;
        case "child":
          afterValue = t('diseaseMembersList.options.child');
          break;
        case "grandpa":
          afterValue = t('diseaseMembersList.options.grandpa');
          break;
        case "other":
          afterValue = t('diseaseMembersList.options.other');
          break;
        case "cancer":
          afterValue = t('diseaseMembersList.options.cancer');
          break;
        case "diabetes":
          afterValue = t('diseaseMembersList.options.diabetes');
          break;
        case "lupus":
          afterValue = t('diseaseMembersList.options.lupus');
          break;
        case "otherCronicDisease":
          afterValue = t('diseaseMembersList.options.otherCronicDisease');
          break;

        default:
          afterValue = "";
          break;
      }

      value = afterValue;
    }

    let rows = [...status.diseaseMembersList.answer];
    let oneItem = rows[idx];

    rows[idx] = {
        ...oneItem,
        [name] : value
    };

    setStatus({
      diseaseMembersList: { show: true, answer: rows }
    })
  }

  const handleMainSourceIncome = ( value ) => {

    nextQuestion("mainSourceIncome")

    if (value === null) 
      return;

    let nexStatus = "";
    switch(value) {
      case t('mainSourceIncome.options.mainSourceIncome1'):
      case t('mainSourceIncome.options.mainSourceIncome2'):
        nexStatus = "workCategory";
        break;

      case t('mainSourceIncome.options.mainSourceIncome3'):
      case t('mainSourceIncome.options.mainSourceIncome4'):
        nexStatus = "headingCompany";
        break;

      case t('mainSourceIncome.options.mainSourceIncome5'):
      case t('mainSourceIncome.options.mainSourceIncome6'):
      case t('mainSourceIncome.options.mainSourceIncome7'):
      case t('mainSourceIncome.options.mainSourceIncome9'):
      case t('mainSourceIncome.options.mainSourceIncome10'):
      case t('mainSourceIncome.options.mainSourceIncome11'):
      case t('mainSourceIncome.options.mainSourceIncome12'):
      case t('mainSourceIncome.options.mainSourceIncome13'):
      case t('mainSourceIncome.options.mainSourceIncome14'):
        nexStatus = "whatCategoryDoes";
        break;

      case t('mainSourceIncome.options.mainSourceIncome8'):
        nexStatus = "areYou";
        break;

      case t('mainSourceIncome.options.mainSourceIncome15'):
        nexStatus = "unemployedPeriod";
        break;

      case t('mainSourceIncome.options.mainSourceIncome16'):
        nexStatus = "receiveMoney";
        break;
        
      default:
        nexStatus = "workCategory";
        break;
    }
    handleQuestion("mainSourceIncome", value, nexStatus);
  }

  const customStyles = {
    control: (base, { selectProps }) => {
      const boxShadow = selectProps.error
        ? { boxShadow: '0 0 0 2px #bf215b' }
        : {}
      return {
        ...base,
        ...boxShadow,
        transition: ' 0.25s linear',
        transitionProperty: 'box-shadow'
      }
    }
  }

  const { t } = useTranslation('form')

  return (
    <FormBox>
      <form onSubmit={handleSubmit}>

        <>
          <InputQuestion
            title={t('firstName.question')}
            onChange={(event) => {
              handleQuestion('firstName', event.target.value, 'lastName')
            }}
            value={status.firstName.answer}
            error={errors.firstName}
          />
        </>

        {status['lastName'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <InputQuestion
          title={t('lastName.question')}
          onChange={( event ) => {
            handleQuestion('lastName', event.target.value, 'idNumber')
          }}
          value={status.lastName.answer}
          error={errors.lastName}
        />
        </>
        )} 

        {status['idNumber'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-lg-6">
              <p className="lead m-lg-0">{t('idNumber.question')}</p>
            </div>
            <div className="col-12 col-lg-5">
              <TextField 
                id="outlined-basic" 
                style={{width: '100%'}}
                variant="outlined" 
                onChange={( event ) => {
                  
                  let {value} = event.target
                  let numberRegExp = /[0-9\b]+$/;
                  if(value !== "" ) {
                    if (!numberRegExp.test(value))
                      return;
                  }
                  handleQuestion('idNumber', event.target.value, 'age')
                }}
                value={status.idNumber.answer}
                error={errors.idNumber}
                required
                />
            </div>
          </div>
        </>
        )}

        {status['gender'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('gender.question')}
            options={[
              { value: t('gender.options.male'), label: t('gender.options.male') },
              { value: t('gender.options.female'), label: t('gender.options.female') }
            ]}
            onChange={({ value }) => {
              handleQuestion('gender', value, 'cellPhoneNumber')
            }}
            value={status.gender.answer}
            error={errors.gender}
          />
        </>
        )}

        {status['cellPhoneNumber'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-lg-6">
                <p className="lead m-lg-0">{t('cellPhoneNumber.question')}</p>
              </div>
              <div className="col-12 col-lg-5">
                <TextField 
                  id="outlined-basic" 
                  style={{width: '100%'}}
                  variant="outlined" 
                  onChange={( event ) => {
                    
                    let {value} = event.target
                    let numberRegExp = /[0-9\b]+$/;
                    if(value !== "" ) {
                      if (!numberRegExp.test(value))
                        return;
                    }
                    handleQuestion('cellPhoneNumber', event.target.value, 'age')
                  }}
                  value={status.cellPhoneNumber.answer}
                  error={errors.cellPhoneNumber}
                  required
                  />
              </div>
            </div>
          </>
        )}

        {status['age'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('age.question')}
              options={Array.from(Array(100)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('age', value, 'neighborhood')
              }}
              value={status.age.answer}
              error={errors.age}
            />
          </>
        )}

        {status['neighborhood'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('neighborhood.question')}
            options={[
              { value: t('neighborhood.options.neighborhood1'), label: t('neighborhood.options.neighborhood1') },
              { value: t('neighborhood.options.neighborhood2'), label: t('neighborhood.options.neighborhood2') },
              { value: t('neighborhood.options.neighborhood3'), label: t('neighborhood.options.neighborhood3') },
              { value: t('neighborhood.options.neighborhood4'), label: t('neighborhood.options.neighborhood4') },
              { value: t('neighborhood.options.neighborhood5'), label: t('neighborhood.options.neighborhood5') },
              { value: t('neighborhood.options.neighborhood6'), label: t('neighborhood.options.neighborhood6') },
              { value: t('neighborhood.options.neighborhood7'), label: t('neighborhood.options.neighborhood7') },
              { value: t('neighborhood.options.neighborhood8'), label: t('neighborhood.options.neighborhood8') },
              { value: t('neighborhood.options.neighborhood9'), label: t('neighborhood.options.neighborhood9') },
              { value: t('neighborhood.options.neighborhood10'), label: t('neighborhood.options.neighborhood10') },
              { value: t('neighborhood.options.neighborhood11'), label: t('neighborhood.options.neighborhood11') },
              { value: t('neighborhood.options.neighborhood12'), label: t('neighborhood.options.neighborhood12') },
              { value: t('neighborhood.options.neighborhood13'), label: t('neighborhood.options.neighborhood13') },
              { value: t('neighborhood.options.neighborhood14'), label: t('neighborhood.options.neighborhood14') },
              { value: t('neighborhood.options.neighborhood15'), label: t('neighborhood.options.neighborhood15') },
              { value: t('neighborhood.options.neighborhood16'), label: t('neighborhood.options.neighborhood16') },
              { value: t('neighborhood.options.neighborhood17'), label: t('neighborhood.options.neighborhood17') },
              { value: t('neighborhood.options.neighborhood18'), label: t('neighborhood.options.neighborhood18') },
              { value: t('neighborhood.options.neighborhood19'), label: t('neighborhood.options.neighborhood19') },
              { value: t('neighborhood.options.neighborhood20'), label: t('neighborhood.options.neighborhood20') },
              { value: t('neighborhood.options.neighborhood21'), label: t('neighborhood.options.neighborhood21') },
              { value: t('neighborhood.options.neighborhood22'), label: t('neighborhood.options.neighborhood22') },
              { value: t('neighborhood.options.neighborhood23'), label: t('neighborhood.options.neighborhood23') },
              { value: t('neighborhood.options.neighborhood24'), label: t('neighborhood.options.neighborhood24') },
              { value: t('neighborhood.options.neighborhood25'), label: t('neighborhood.options.neighborhood25') },
              { value: t('neighborhood.options.neighborhood26'), label: t('neighborhood.options.neighborhood26') },
              { value: t('neighborhood.options.neighborhood27'), label: t('neighborhood.options.neighborhood27') },
              { value: t('neighborhood.options.neighborhood28'), label: t('neighborhood.options.neighborhood28') },
              { value: t('neighborhood.options.neighborhood29'), label: t('neighborhood.options.neighborhood29') },
              { value: t('neighborhood.options.neighborhood30'), label: t('neighborhood.options.neighborhood30') },
              { value: t('neighborhood.options.neighborhood31'), label: t('neighborhood.options.neighborhood31') },
              { value: t('neighborhood.options.neighborhood32'), label: t('neighborhood.options.neighborhood32') },
              { value: t('neighborhood.options.neighborhood33'), label: t('neighborhood.options.neighborhood33') },
              { value: t('neighborhood.options.neighborhood34'), label: t('neighborhood.options.neighborhood34') },
              { value: t('neighborhood.options.neighborhood35'), label: t('neighborhood.options.neighborhood35') },
              { value: t('neighborhood.options.neighborhood36'), label: t('neighborhood.options.neighborhood36') },
              { value: t('neighborhood.options.neighborhood37'), label: t('neighborhood.options.neighborhood37') },
              { value: t('neighborhood.options.neighborhood38'), label: t('neighborhood.options.neighborhood38') },
              { value: t('neighborhood.options.neighborhood39'), label: t('neighborhood.options.neighborhood39') },
              { value: t('neighborhood.options.neighborhood40'), label: t('neighborhood.options.neighborhood40') },
              { value: t('neighborhood.options.neighborhood41'), label: t('neighborhood.options.neighborhood41') },
              { value: t('neighborhood.options.neighborhood42'), label: t('neighborhood.options.neighborhood42') },
              { value: t('neighborhood.options.neighborhood43'), label: t('neighborhood.options.neighborhood43') }
            ]}
            onChange={({ value }) => {
              handleQuestion('neighborhood', value, 'address')
            }}
            value={status.neighborhood.answer}
            error={errors.neighborhood}
          />
        </>
        )}

        {status['address'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <InputQuestion
          title={t('address.question')}
          onChange={(event) => {
            handleQuestion('address', event.target.value, 'houseMembers')
          }}
          value={status.address.answer}
          error={errors.address}
        />
        </>
        )}

        {status['houseMembers'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('houseMembers.question')}
              options={Array.from(Array(10)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('houseMembers', value, 'liveInHome')
                createMemberList(value)
              }}
              value={status.houseMembers.answer}
              error={errors.houseMembers}
            />
          </>
        )} 
        
        {status['liveInHome'].show && (
          <>
            {status.houseMembers.answer === 0 
              ? null 
              :
                <Table borderless responsive style={{marginTop: 70, marginBottom: 50}}>
                  <thead>        
                    <tr style={{backgroundColor: '#dcdcdc', color: 'grey', cursor: 'pointer' }}>
                      <th style={{width: '5%', textAlign: 'center'}}>{t('houseMembersList.options.no')}</th>
                      <th style={{width: '5%', textAlign: 'center'}}>{t('houseMembersList.options.relation')}</th>
                      <th style={{width: '30%', textAlign: 'center'}}>{t('houseMembersList.options.age')}</th>
                      <th style={{width: '30%', textAlign: 'center'}}>{t('houseMembersList.options.idNumber')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.houseMembersList.answer.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{width: '5%', textAlign: 'center'}}>
                          {idx + 1}
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <NativeSelect
                            onChange={(event) => {
                              changeHouseMembersList(idx, event)
                            }}
                            name="relation"
                            className={{marginTop: 10}}
                            inputProps={{ 'aria-label': 'relation' }}
                            style={{marginLeft: 30, fontSize: 18}}
                          >
                            <option value="selectMember"> {t('houseMembersList.options.selectRelation')} </option>
                            <option value="father">{t('houseMembersList.options.father')}</option>
                            <option value="mother">{t('houseMembersList.options.mother')}</option>
                            <option value="partner">{t('houseMembersList.options.partner')}</option>
                            <option value="child">{t('houseMembersList.options.child')}</option>
                            <option value="grandpa">{t('houseMembersList.options.grandpa')}</option>
                            <option value="other">{t('houseMembersList.options.other')}</option>
                          </NativeSelect>           
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <TextField
                            fullWidth
                            helperText=""
                            label=""
                            name="age"
                            placeholder="Age"
                            onChange={(event) => {

                              let {value} = event.target
                              let numberRegExp = /[0-9\b]+$/;
                              if(value !== "") {
                                if (!numberRegExp.test(value))
                                  return;
                              }
                              changeHouseMembersList(idx, event)
                            }}
                            value={status.houseMembersList.answer[idx].age}
                            required
                          />                        

                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <TextField
                            fullWidth
                            helperText=""
                            label=""
                            name="idNumber"
                            placeholder="ID Number"
                            onChange={(event) => {

                              let {value} = event.target
                              let numberRegExp = /[0-9\b]+$/;
                              if(value !== "") {
                                if (!numberRegExp.test(value))
                                  return;
                              }
                              changeHouseMembersList(idx, event)
                            }}
                            value={status.houseMembersList.answer[idx].idNumber}
                          />                        
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            }
          </>
        )}

        {status['liveInHome'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('liveInHome.question')}
            options={[
              { value: t('liveInHome.options.own'), label: t('liveInHome.options.own') },
              { value: t('liveInHome.options.rental'), label: t('liveInHome.options.rental') },
              { value: t('liveInHome.options.settlement'), label: t('liveInHome.options.settlement') },
              { value: t('liveInHome.options.municipalland'), label: t('liveInHome.options.municipalland') },
              { value: t('liveInHome.options.sas'), label: t('liveInHome.options.sas') },
              { value: t('liveInHome.options.payingFeeLoan'), label: t('liveInHome.options.payingFeeLoan') }
            ]}
            onChange={({ value }) => {
              handleQuestion('liveInHome', value, 'houseMaterial')
            }}
            value={status.liveInHome.answer}
            error={errors.liveInHome}
          />
        </>
        )}

        {status['houseMaterial'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('houseMaterial.question')}
            options={[
              { value: t('houseMaterial.options.houseMaterial1'), label: t('houseMaterial.options.houseMaterial1') },
              { value: t('houseMaterial.options.houseMaterial2'), label: t('houseMaterial.options.houseMaterial2') },
              { value: t('houseMaterial.options.houseMaterial3'), label: t('houseMaterial.options.houseMaterial3') }
            ]}
            onChange={({ value }) => {
              handleQuestion('houseMaterial', value, 'floor')
            }}
            value={status.houseMaterial.answer}
            error={errors.houseMaterial}
          />
        </>
        )}
        
        {status['floor'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('floor.question')}
            options={[
              { value: t('floor.options.floor1'), label: t('floor.options.floor1') },
              { value: t('floor.options.floor2'), label: t('floor.options.floor2') },
              { value: t('floor.options.floor3'), label: t('floor.options.floor3') }
            ]}
            onChange={({ value }) => {
              handleQuestion('floor', value, 'roof')
            }}
            value={status.floor.answer}
            error={errors.floor}
          />
        </>
        )}

        {status['roof'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('roof.question')}
            options={[
              { value: t('roof.options.roof1'), label: t('roof.options.roof1') },
              { value: t('roof.options.roof2'), label: t('roof.options.roof2') },
              { value: t('roof.options.roof3'), label: t('roof.options.roof3') }
            ]}
            onChange={({ value }) => {
              handleQuestion('roof', value, 'bathroom')
            }}
            value={status.roof.answer}
            error={errors.roof}
          />
        </>
        )}
        
        {status['bathroom'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('bathroom.question')}
            options={[
              { value: t('bathroom.options.bathroom1'), label: t('bathroom.options.bathroom1') },
              { value: t('bathroom.options.bathroom2'), label: t('bathroom.options.bathroom2') },
              { value: t('bathroom.options.bathroom3'), label: t('bathroom.options.bathroom3') }
            ]}
            onChange={({ value }) => {
              handleQuestion('bathroom', value, 'water')
            }}
            value={status.bathroom.answer}
            error={errors.bathroom}
          />
        </>
        )}
        
        {status['water'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('water.question')}
            options={[
              { value: t('water.options.water1'), label: t('water.options.water1') },
              { value: t('water.options.water2'), label: t('water.options.water2') },
              { value: t('water.options.water3'), label: t('water.options.water3') }
            ]}
            onChange={({ value }) => {
              handleQuestion('water', value, 'cooking')
            }}
            value={status.water.answer}
            error={errors.water}
          />
        </>
        )}
        
        {status['cooking'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('cooking.question')}
            options={[
              { value: t('cooking.options.cooking1'), label: t('cooking.options.cooking1') },
              { value: t('cooking.options.cooking2'), label: t('cooking.options.cooking2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('cooking', value, 'guarani')
            }}
            value={status.cooking.answer}
            error={errors.cooking}
          />
        </>
        )}
           
        {status['guarani'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-lg-6">
              <p className="lead m-lg-0">{t('asset.question')}</p>
            </div>
            <div className="col-12 col-lg-5">
              <Select
                options={[
                  { value: t('asset.options.asset1'), label: t('asset.options.asset1') },
                  { value: t('asset.options.asset2'), label: t('asset.options.asset2') },
                  { value: t('asset.options.asset3'), label: t('asset.options.asset3') },
                  { value: t('asset.options.asset4'), label: t('asset.options.asset4') },
                  { value: t('asset.options.asset5'), label: t('asset.options.asset5') },
                  { value: t('asset.options.asset6'), label: t('asset.options.asset6') },
                  { value: t('asset.options.asset7'), label: t('asset.options.asset7') },
                  { value: t('asset.options.asset8'), label: t('asset.options.asset8') },
                  { value: t('asset.options.asset9'), label: t('asset.options.asset9') },
                  { value: t('asset.options.asset10'), label: t('asset.options.asset10') }
                ]}
                isMulti
                isSearchable={false}
                onChange={(event) => handleAsset(event)}
                // value={selectedValue}
                styles={customStyles}
                error={errors.asset}
                placeholder={t('placeholder')}
              />
              {errors.asset && (
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  {t('pleaseChoose')}
                </div>
              )}
            </div>
          </div>
        </>
        )}     

        {status['guarani'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('guarani.question')}
              options={Array.from(Array(10)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('guarani', value, 'suspectedCase')
              }}
              value={status.guarani.answer}
              error={errors.guarani}
            />
          </>
        )}

        {status['suspectedCase'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('symptomsType.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <Select
              options={[
                { value: t('symptomsType.options.symptomsType1'), label: t('symptomsType.options.symptomsType1') },
                { value: t('symptomsType.options.symptomsType2'), label: t('symptomsType.options.symptomsType2') },
                { value: t('symptomsType.options.symptomsType3'), label: t('symptomsType.options.symptomsType3') },
                { value: t('symptomsType.options.symptomsType4'), label: t('symptomsType.options.symptomsType4') },
                { value: t('symptomsType.options.symptomsType5'), label: t('symptomsType.options.symptomsType5') },
                { value: t('symptomsType.options.symptomsType6'), label: t('symptomsType.options.symptomsType6') },
                { value: t('symptomsType.options.symptomsType7'), label: t('symptomsType.options.symptomsType7') },
              ]}
              isMulti
              isSearchable={false}
              onChange={(event) => handleSymptomsType(event)}
              // value={selectedValue}
              styles={customStyles}
              error={errors.symptomsType}
              placeholder={t('placeholder')}
            />
            {errors.symptomsType && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {t('pleaseChoose')}
              </div>
            )}
          </div>
        </div>
      </>
      )}
              
        {status['suspectedCase'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('suspectedCase.question')}
            options={[
              { value: t('suspectedCase.options.suspectedCase1'), label: t('suspectedCase.options.suspectedCase1') },
              { value: t('suspectedCase.options.suspectedCase2'), label: t('suspectedCase.options.suspectedCase2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('suspectedCase', value, 'suffering')
            }}
            value={status.suspectedCase.answer}
            error={errors.suspectedCase}
          />
        </>
        )}
                      
        {status['suffering'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('suffering.question')}
            options={[
              { value: t('suffering.options.suffering1'), label: t('suffering.options.suffering1') },
              { value: t('suffering.options.suffering2'), label: t('suffering.options.suffering2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('suffering', value, 'diseaseMembers')
            }}
            value={status.suffering.answer}
            error={errors.suffering}
          />
        </>
        )}

        {status['diseaseMembers'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('diseaseMembers.question')}
              options={Array.from(Array(10)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('diseaseMembers', value, 'regularVisitors')
                createDiseaseMembersList(value)
              }}
              value={status.diseaseMembers.answer}
              error={errors.diseaseMembers}
            />
          </>
        )}
        
        {status['regularVisitors'].show && (
          <>
            {status.diseaseMembers.answer === 0 
              ? null 
              : 
                <Table borderless responsive style={{marginTop: 70, marginBottom: 50}}>
                  <thead>        
                    <tr style={{backgroundColor: '#dcdcdc', color: 'grey', cursor: 'pointer' }}>
                      <th style={{width: '5%', textAlign: 'center'}}>{t('diseaseMembersList.options.no')}</th>
                      <th style={{width: '5%', textAlign: 'center'}}>{t('diseaseMembersList.options.relation')}</th>
                      <th style={{width: '30%', textAlign: 'center'}}>{t('diseaseMembersList.options.age')}</th>
                      <th style={{width: '30%', textAlign: 'center'}}>{t('diseaseMembersList.options.disease')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.diseaseMembersList.answer.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{width: '5%', textAlign: 'center'}}>
                          {idx + 1}
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <NativeSelect
                            onChange={(event) => {
                              changeDiseaseMemberList(idx, event)
                            }}
                            name="relation"
                            className={{marginTop: 10}}
                            inputProps={{ 'aria-label': 'relation' }}
                            style={{marginLeft: 30, fontSize: 18}}
                          >
                            <option value="selectMember"> {t('diseaseMembersList.options.selectRelation')} </option>
                            <option value="father">{t('diseaseMembersList.options.father')}</option>
                            <option value="mother">{t('diseaseMembersList.options.mother')}</option>
                            <option value="partner">{t('diseaseMembersList.options.partner')}</option>
                            <option value="child">{t('diseaseMembersList.options.child')}</option>
                            <option value="grandpa">{t('diseaseMembersList.options.grandpa')}</option>
                            <option value="other">{t('diseaseMembersList.options.other')}</option>
                          </NativeSelect>           
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <TextField
                            fullWidth
                            helperText=""
                            label=""
                            name="age"
                            placeholder="Age"
                            onChange={(event) => {

                              let {value} = event.target
                              let numberRegExp = /[0-9\b]+$/;
                              if(value !== "") {
                                if (!numberRegExp.test(value))
                                  return;
                              }
                              changeDiseaseMemberList(idx, event)
                            }}
                            value={status.diseaseMembersList.answer[idx].age}
                            required
                          />                        
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <NativeSelect
                            onChange={(event) => {
                              changeDiseaseMemberList(idx, event)
                            }}
                            name="disease"
                            className={{marginTop: 10}}
                            inputProps={{ 'aria-label': 'disease' }}
                            style={{marginLeft: 30, fontSize: 18}}
                          >
                            <option value="selectDisease"> {t('diseaseMembersList.options.selectDisease')} </option>
                            <option value="cancer">{t('diseaseMembersList.options.cancer')}</option>
                            <option value="diabetes">{t('diseaseMembersList.options.diabetes')}</option>
                            <option value="lupus">{t('diseaseMembersList.options.lupus')}</option>
                            <option value="otherCronicDisease">{t('diseaseMembersList.options.otherCronicDisease')}</option>
                          </NativeSelect>                       
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            }
          </>
        )}

        {status['regularVisitors'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('regularVisitors.question')}
              options={Array.from(Array(10)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('regularVisitors', value, 'mainSourceIncome')
              }}
              value={status.regularVisitors.answer}
              error={errors.regularVisitors}
            />
          </>
        )}


        {
        // Indicated Branch 
        }
        {status['mainSourceIncome'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('mainSourceIncome.question')}
            options={[
              { value: t('mainSourceIncome.options.mainSourceIncome1'), label: t('mainSourceIncome.options.mainSourceIncome1') },
              { value: t('mainSourceIncome.options.mainSourceIncome2'), label: t('mainSourceIncome.options.mainSourceIncome2') },
              { value: t('mainSourceIncome.options.mainSourceIncome3'), label: t('mainSourceIncome.options.mainSourceIncome3') },
              { value: t('mainSourceIncome.options.mainSourceIncome4'), label: t('mainSourceIncome.options.mainSourceIncome4') },
              { value: t('mainSourceIncome.options.mainSourceIncome5'), label: t('mainSourceIncome.options.mainSourceIncome5') },
              { value: t('mainSourceIncome.options.mainSourceIncome6'), label: t('mainSourceIncome.options.mainSourceIncome6') },
              { value: t('mainSourceIncome.options.mainSourceIncome7'), label: t('mainSourceIncome.options.mainSourceIncome7') },
              { value: t('mainSourceIncome.options.mainSourceIncome8'), label: t('mainSourceIncome.options.mainSourceIncome8') },
              { value: t('mainSourceIncome.options.mainSourceIncome9'), label: t('mainSourceIncome.options.mainSourceIncome9') },
              { value: t('mainSourceIncome.options.mainSourceIncome10'), label: t('mainSourceIncome.options.mainSourceIncome10') },
              { value: t('mainSourceIncome.options.mainSourceIncome11'), label: t('mainSourceIncome.options.mainSourceIncome11') },
              { value: t('mainSourceIncome.options.mainSourceIncome12'), label: t('mainSourceIncome.options.mainSourceIncome12') },
              { value: t('mainSourceIncome.options.mainSourceIncome13'), label: t('mainSourceIncome.options.mainSourceIncome13') },
              { value: t('mainSourceIncome.options.mainSourceIncome14'), label: t('mainSourceIncome.options.mainSourceIncome14') },
              { value: t('mainSourceIncome.options.mainSourceIncome15'), label: t('mainSourceIncome.options.mainSourceIncome15') },
              { value: t('mainSourceIncome.options.mainSourceIncome16'), label: t('mainSourceIncome.options.mainSourceIncome16') },
            ]}
            onChange={({ value }) => {
              handleMainSourceIncome(value)
            }}
            value={status.mainSourceIncome.answer}
            error={errors.mainSourceIncome}
          />
        </>
        )}

        {
          // 4.1 In what category you work? 
        }
        {status['workCategory'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('workCategory.question')}
            options={[
              { value: t('workCategory.options.workCategory1'), label: t('workCategory.options.workCategory1') },
              { value: t('workCategory.options.workCategory2'), label: t('workCategory.options.workCategory2') },
              { value: t('workCategory.options.workCategory3'), label: t('workCategory.options.workCategory3') },
              { value: t('workCategory.options.workCategory4'), label: t('workCategory.options.workCategory4') },
              { value: t('workCategory.options.workCategory5'), label: t('workCategory.options.workCategory5') },
            ]}
            onChange={({ value }) => {
              handleQuestion('workCategory', value, 'employeesNumber')
            }}
            value={status.workCategory.answer}
            error={errors.workCategory}
          />
        </>
        )}

        {status['workCategory'].show && status['employeesNumber'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('employeesNumber.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('employeesNumber', event.target.value, 'allIPS')
              }}
              value={status.employeesNumber.answer}
              error={errors.employeesNumber}
              required
              />
          </div>
        </div>
      </>

        )}

        {status['workCategory'].show && status['allIPS'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('allIPS.question')}
            options={[
              { value: t('allIPS.options.allIPS1'), label: t('allIPS.options.allIPS1') },
              { value: t('allIPS.options.allIPS2'), label: t('allIPS.options.allIPS2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('allIPS', value, 'layOffEmployees')
            }}
            value={status.allIPS.answer}
            error={errors.allIPS}
          />
        </>
        )}

        {status['workCategory'].show && status['layOffEmployees'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('layOffEmployees.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('layOffEmployees', event.target.value, 'businessSituation')
              }}
              value={status.layOffEmployees.answer}
              error={errors.layOffEmployees}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['workCategory'].show && status['businessSituation'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('businessSituation.question')}
            options={[
              { value: t('businessSituation.options.businessSituation1'), label: t('businessSituation.options.businessSituation1') },
              { value: t('businessSituation.options.businessSituation2'), label: t('businessSituation.options.businessSituation2') },
              { value: t('businessSituation.options.businessSituation3'), label: t('businessSituation.options.businessSituation3') }
            ]}
            onChange={({ value }) => {
              handleQuestion('businessSituation', value, 'businessStrategy')
            }}
            value={status.businessSituation.answer}
            error={errors.businessSituation}
          />
        </>
        )}
        
        {status['workCategory'].show && status['businessStrategy'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('businessStrategy.question')}
            options={[
              { value: t('businessStrategy.options.businessStrategy1'), label: t('businessStrategy.options.businessStrategy1') },
              { value: t('businessStrategy.options.businessStrategy2'), label: t('businessStrategy.options.businessStrategy2') },
              { value: t('businessStrategy.options.businessStrategy3'), label: t('businessStrategy.options.businessStrategy3') },
              { value: t('businessStrategy.options.businessStrategy4'), label: t('businessStrategy.options.businessStrategy4') },
              { value: t('businessStrategy.options.businessStrategy5'), label: t('businessStrategy.options.businessStrategy5') }
            ]}
            onChange={({ value }) => {
              handleQuestion('businessStrategy', value, 'amountMarchMoney')
            }}
            value={status.businessStrategy.answer}
            error={errors.businessStrategy}
          />
        </>
        )}

        {status['workCategory'].show && status['amountMarchMoney'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('amountMarchMoney.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('amountMarchMoney', event.target.value, 'amountAprilMoney')
              }}
              value={status.amountMarchMoney.answer}
              error={errors.amountMarchMoney}
              required
              />
          </div>
        </div>
        </>
        )}
        
        {status['workCategory'].show && status['amountAprilMoney'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('amountAprilMoney.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('amountAprilMoney', event.target.value, 'commentMayerWorkCategory')
              }}
              value={status.amountAprilMoney.answer}
              error={errors.amountAprilMoney}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['workCategory'].show && status['commentMayerWorkCategory'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayerWorkCategory', event.target.value, 'end')
          }}
          value={status.commentMayerWorkCategory.answer}
          error={errors.commentMayerWorkCategory}
        />
        </>
        )}        

        {
        // 5.1 What it is operating heading the company? 
        }
        {status['headingCompany'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('headingCompany.question')}
            options={[
              { value: t('headingCompany.options.headingCompany1'), label: t('headingCompany.options.headingCompany1') },
              { value: t('headingCompany.options.headingCompany2'), label: t('headingCompany.options.headingCompany2') },
              { value: t('headingCompany.options.headingCompany3'), label: t('headingCompany.options.headingCompany3') },
              { value: t('headingCompany.options.headingCompany4'), label: t('headingCompany.options.headingCompany4') },
              { value: t('headingCompany.options.headingCompany5'), label: t('headingCompany.options.headingCompany5') },
            ]}
            onChange={({ value }) => {
              handleQuestion('headingCompany', value, 'role')
            }}
            value={status.headingCompany.answer}
            error={errors.headingCompany}
          />
        </>
        )}
                
        {status['headingCompany'].show && status['role'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('role.question')}
            options={[
              { value: t('role.options.role1'), label: t('role.options.role1') },
              { value: t('role.options.role2'), label: t('role.options.role2') },
              { value: t('role.options.role3'), label: t('role.options.role3') },
              { value: t('role.options.role4'), label: t('role.options.role4') },
              { value: t('role.options.role5'), label: t('role.options.role5') },
              { value: t('role.options.role6'), label: t('role.options.role6') }
            ]}
            onChange={({ value }) => {
              handleQuestion('role', value, 'expectIPSHeadingCompany')
            }}
            value={status.role.answer}
            error={errors.role}
          />
        </>
        )}

        {status['headingCompany'].show && status['expectIPSHeadingCompany'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('expectIPS.question')}
            options={[
              { value: t('expectIPSHeadingCompany.options.expectIPSHeadingCompany1'), label: t('expectIPSHeadingCompany.options.expectIPSHeadingCompany1') },
              { value: t('expectIPSHeadingCompany.options.expectIPSHeadingCompany2'), label: t('expectIPSHeadingCompany.options.expectIPSHeadingCompany2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('expectIPSHeadingCompany', value, 'loseJobHeadingCompany')
            }}
            value={status.expectIPSHeadingCompany.answer}
            error={errors.expectIPSHeadingCompany}
          />
        </>
        )}
        
        {status['headingCompany'].show && status['loseJobHeadingCompany'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('loseJob.question')}
            options={[
              { value: t('loseJobHeadingCompany.options.loseJobHeadingCompany1'), label: t('loseJobHeadingCompany.options.loseJobHeadingCompany1') },
              { value: t('loseJobHeadingCompany.options.loseJobHeadingCompany2'), label: t('loseJobHeadingCompany.options.loseJobHeadingCompany2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('loseJobHeadingCompany', value, 'guaraniEnterHeadingCompany')
            }}
            value={status.loseJobHeadingCompany.answer}
            error={errors.loseJobHeadingCompany}
          />
        </>
        )}
        
        {status['headingCompany'].show && status['guaraniEnterHeadingCompany'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('guaraniEnter.question')}
              options={Array.from(Array(10)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('guaraniEnterHeadingCompany', value, 'workplaceHeadingCompany')
              }}
              value={status.guaraniEnterHeadingCompany.answer}
              error={errors.guaraniEnterHeadingCompany}
            />
          </>
        )}
                
        {status['headingCompany'].show && status['workplaceHeadingCompany'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('workplace.question')}
            options={[
              { value: t('workplaceHeadingCompany.options.workplaceHeadingCompany1'), label: t('workplaceHeadingCompany.options.workplaceHeadingCompany1') },
              { value: t('workplaceHeadingCompany.options.workplaceHeadingCompany2'), label: t('workplaceHeadingCompany.options.workplaceHeadingCompany2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('workplaceHeadingCompany', value, 'shareWorkplaceHeadingCompany')
            }}
            value={status.workplaceHeadingCompany.answer}
            error={errors.workplaceHeadingCompany}
          />
        </>
        )}
                
        {status['headingCompany'].show && status['shareWorkplaceHeadingCompany'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('shareWorkplace.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('shareWorkplaceHeadingCompany', event.target.value, 'commentMayerHeadingCompany')
              }}
              value={status.shareWorkplaceHeadingCompany.answer}
              error={errors.shareWorkplaceHeadingCompany}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['headingCompany'].show && status['commentMayerHeadingCompany'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayerHeadingCompany', event.target.value, 'end')
          }}
          value={status.commentMayerHeadingCompany.answer}
          error={errors.commentMayerHeadingCompany}
        />
        </>
        )} 

        {
        // 6.1 What category does its work? 
        }
        {status['whatCategoryDoes'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('whatCategoryDoes.question')}
            options={[
              { value: t('whatCategoryDoes.options.whatCategoryDoes1'), label: t('whatCategoryDoes.options.whatCategoryDoes1') },
              { value: t('whatCategoryDoes.options.whatCategoryDoes2'), label: t('whatCategoryDoes.options.whatCategoryDoes2') },
              { value: t('whatCategoryDoes.options.whatCategoryDoes3'), label: t('whatCategoryDoes.options.whatCategoryDoes3') },
              { value: t('whatCategoryDoes.options.whatCategoryDoes4'), label: t('whatCategoryDoes.options.whatCategoryDoes4') },
              { value: t('whatCategoryDoes.options.whatCategoryDoes5'), label: t('whatCategoryDoes.options.whatCategoryDoes5') },
            ]}
            onChange={({ value }) => {
              handleQuestion('whatCategoryDoes', value, 'expectIPSWhatCategoryDoes')
            }}
            value={status.whatCategoryDoes.answer}
            error={errors.whatCategoryDoes}
          />
        </>
        )}

        {status['whatCategoryDoes'].show && status['expectIPSWhatCategoryDoes'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('expectIPS.question')}
            options={[
              { value: t('expectIPSWhatCategoryDoes.options.expectIPSWhatCategoryDoes1'), label: t('expectIPSWhatCategoryDoes.options.expectIPSWhatCategoryDoes1') },
              { value: t('expectIPSWhatCategoryDoes.options.expectIPSWhatCategoryDoes2'), label: t('expectIPSWhatCategoryDoes.options.expectIPSWhatCategoryDoes2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('expectIPSWhatCategoryDoes', value, 'loseJobWhatCategoryDoes')
            }}
            value={status.expectIPSWhatCategoryDoes.answer}
            error={errors.expectIPSWhatCategoryDoes}
          />
        </>
        )}
        
        {status['whatCategoryDoes'].show && status['loseJobWhatCategoryDoes'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('loseJob.question')}
            options={[
              { value: t('loseJobWhatCategoryDoes.options.loseJobWhatCategoryDoes1'), label: t('loseJobWhatCategoryDoes.options.loseJobWhatCategoryDoes1') },
              { value: t('loseJobWhatCategoryDoes.options.loseJobWhatCategoryDoes2'), label: t('loseJobWhatCategoryDoes.options.loseJobWhatCategoryDoes2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('loseJobWhatCategoryDoes', value, 'guaraniEnterWhatCategoryDoes')
            }}
            value={status.loseJobWhatCategoryDoes.answer}
            error={errors.loseJobWhatCategoryDoes}
          />
        </>
        )}
        
        {status['whatCategoryDoes'].show && status['guaraniEnterWhatCategoryDoes'].show && (
          <>
            <hr className="mb-5 mt-5" />
            <Question
              title={t('guaraniEnter.question')}
              options={Array.from(Array(10)).map((_, i) => {
                return {
                  value: i,
                  label: i
                }
              })}
              onChange={({ value }) => {
                handleQuestion('guaraniEnterWhatCategoryDoes', value, 'workplaceWhatCategoryDoes')
              }}
              value={status.guaraniEnterWhatCategoryDoes.answer}
              error={errors.guaraniEnterWhatCategoryDoes}
            />
          </>
        )}
                
        {status['whatCategoryDoes'].show && status['workplaceWhatCategoryDoes'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('workplace.question')}
            options={[
              { value: t('workplaceWhatCategoryDoes.options.workplaceWhatCategoryDoes1'), label: t('workplaceWhatCategoryDoes.options.workplaceWhatCategoryDoes1') },
              { value: t('workplaceWhatCategoryDoes.options.workplaceWhatCategoryDoes2'), label: t('workplaceWhatCategoryDoes.options.workplaceWhatCategoryDoes2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('workplaceWhatCategoryDoes', value, 'shareWorkplaceWhatCategoryDoes')
            }}
            value={status.workplaceWhatCategoryDoes.answer}
            error={errors.workplaceWhatCategoryDoes}
          />
        </>
        )}
                
        {status['whatCategoryDoes'].show && status['shareWorkplaceWhatCategoryDoes'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('shareWorkplace.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('shareWorkplaceWhatCategoryDoes', event.target.value, 'commentMayerWhatCategoryDoes')
              }}
              value={status.shareWorkplaceWhatCategoryDoes.answer}
              error={errors.shareWorkplaceWhatCategoryDoes}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['whatCategoryDoes'].show && status['commentMayerWhatCategoryDoes'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayerWhatCategoryDoes', event.target.value, 'end')
          }}
          value={status.commentMayerWhatCategoryDoes.answer}
          error={errors.commentMayerWhatCategoryDoes}
        />
        </>
        )} 

        {
        // 7.1 Are you: 
        }
        {status['areYou'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('areYou.question')}
            options={[
              { value: t('areYou.options.areYou1'), label: t('areYou.options.areYou1') },
              { value: t('areYou.options.areYou2'), label: t('areYou.options.areYou2') },
              { value: t('areYou.options.areYou3'), label: t('areYou.options.areYou3') },
              { value: t('areYou.options.areYou4'), label: t('areYou.options.areYou4') }
            ]}
            onChange={({ value }) => {
              handleQuestion('areYou', value, 'medicalCenterServing')
            }}
            value={status.areYou.answer}
            error={errors.areYou}
          />
        </>
        )}

        {status['areYou'].show && status['medicalCenterServing'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('medicalCenterServing.question')}
            options={[
              { value: t('medicalCenterServing.options.medicalCenterServing1'), label: t('medicalCenterServing.options.medicalCenterServing1') },
              { value: t('medicalCenterServing.options.medicalCenterServing2'), label: t('medicalCenterServing.options.medicalCenterServing2') },
              { value: t('medicalCenterServing.options.medicalCenterServing3'), label: t('medicalCenterServing.options.medicalCenterServing3') },
              { value: t('medicalCenterServing.options.medicalCenterServing4'), label: t('medicalCenterServing.options.medicalCenterServing4') },
              { value: t('medicalCenterServing.options.medicalCenterServing5'), label: t('medicalCenterServing.options.medicalCenterServing5') },
              { value: t('medicalCenterServing.options.medicalCenterServing6'), label: t('medicalCenterServing.options.medicalCenterServing6') },
              { value: t('medicalCenterServing.options.medicalCenterServing7'), label: t('medicalCenterServing.options.medicalCenterServing7') },
              { value: t('medicalCenterServing.options.medicalCenterServing8'), label: t('medicalCenterServing.options.medicalCenterServing8') },
              { value: t('medicalCenterServing.options.medicalCenterServing9'), label: t('medicalCenterServing.options.medicalCenterServing9') },
              { value: t('medicalCenterServing.options.medicalCenterServing10'), label: t('medicalCenterServing.options.medicalCenterServing10') },
              { value: t('medicalCenterServing.options.medicalCenterServing11'), label: t('medicalCenterServing.options.medicalCenterServing11') },
              { value: t('medicalCenterServing.options.medicalCenterServing12'), label: t('medicalCenterServing.options.medicalCenterServing12') },
              { value: t('medicalCenterServing.options.medicalCenterServing13'), label: t('medicalCenterServing.options.medicalCenterServing13') },
              { value: t('medicalCenterServing.options.medicalCenterServing14'), label: t('medicalCenterServing.options.medicalCenterServing14') },
              { value: t('medicalCenterServing.options.medicalCenterServing15'), label: t('medicalCenterServing.options.medicalCenterServing15') },
              { value: t('medicalCenterServing.options.medicalCenterServing16'), label: t('medicalCenterServing.options.medicalCenterServing16') },
              { value: t('medicalCenterServing.options.medicalCenterServing17'), label: t('medicalCenterServing.options.medicalCenterServing17') },
              { value: t('medicalCenterServing.options.medicalCenterServing18'), label: t('medicalCenterServing.options.medicalCenterServing18') },
              { value: t('medicalCenterServing.options.medicalCenterServing19'), label: t('medicalCenterServing.options.medicalCenterServing19') },
              { value: t('medicalCenterServing.options.medicalCenterServing20'), label: t('medicalCenterServing.options.medicalCenterServing20') },
              { value: t('medicalCenterServing.options.medicalCenterServing21'), label: t('medicalCenterServing.options.medicalCenterServing21') },
              { value: t('medicalCenterServing.options.medicalCenterServing22'), label: t('medicalCenterServing.options.medicalCenterServing22') }
            ]}
            onChange={({ value }) => {
              handleQuestion('medicalCenterServing', value, 'instruments')
            }}
            value={status.medicalCenterServing.answer}
            error={errors.medicalCenterServing}
          />
        </>
        )}
                
        {status['areYou'].show && status['instruments'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('instruments.question')}
            options={[
              { value: t('instruments.options.instruments1'), label: t('instruments.options.instruments1') },
              { value: t('instruments.options.instruments2'), label: t('instruments.options.instruments2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('instruments', value, 'suspectedCaseMedicalCenter')
            }}
            value={status.instruments.answer}
            error={errors.instruments}
          />
        </>
        )}
                        
        {status['areYou'].show && status['suspectedCaseMedicalCenter'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('suspectedCaseMedicalCenter.question')}
            options={[
              { value: t('suspectedCaseMedicalCenter.options.suspectedCaseMedicalCenter1'), label: t('suspectedCaseMedicalCenter.options.suspectedCaseMedicalCenter1') },
              { value: t('suspectedCaseMedicalCenter.options.suspectedCaseMedicalCenter2'), label: t('suspectedCaseMedicalCenter.options.suspectedCaseMedicalCenter2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('suspectedCaseMedicalCenter', value, 'commentMayerAreYou')
            }}
            value={status.suspectedCaseMedicalCenter.answer}
            error={errors.suspectedCaseMedicalCenter}
          />
        </>
        )}

        {status['areYou'].show && status['commentMayerAreYou'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayerAreYou', event.target.value, 'end')
          }}
          value={status.commentMayerAreYou.answer}
          error={errors.commentMayerAreYou}
        />
        </>
        )} 

        {
        // 8.1 How long have become unemployed? 
        }
        {status['unemployedPeriod'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('unemployedPeriod.question')}
            options={[
              { value: t('unemployedPeriod.options.unemployedPeriod1'), label: t('unemployedPeriod.options.unemployedPeriod1') },
              { value: t('unemployedPeriod.options.unemployedPeriod2'), label: t('unemployedPeriod.options.unemployedPeriod2') },
              { value: t('unemployedPeriod.options.unemployedPeriod3'), label: t('unemployedPeriod.options.unemployedPeriod3') },
              { value: t('unemployedPeriod.options.unemployedPeriod4'), label: t('unemployedPeriod.options.unemployedPeriod4') }
            ]}
            onChange={({ value }) => {
              handleQuestion('unemployedPeriod', value, 'produceFood')
            }}
            value={status.unemployedPeriod.answer}
            error={errors.unemployedPeriod}
          />
        </>
        )}
                                
        {status['unemployedPeriod'].show && status['produceFood'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('produceFood.question')}
            options={[
              { value: t('produceFood.options.produceFood1'), label: t('produceFood.options.produceFood1') },
              { value: t('produceFood.options.produceFood2'), label: t('produceFood.options.produceFood2') },
            ]}
            onChange={({ value }) => {
              handleQuestion('produceFood', value, 'surviveMoney')
            }}
            value={status.produceFood.answer}
            error={errors.produceFood}
          />
        </>
        )}
                        
        {status['unemployedPeriod'].show && status['surviveMoney'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('surviveMoney.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('surviveMoney', event.target.value, 'commentMayerUnemployedPeriod')
              }}
              value={status.surviveMoney.answer}
              error={errors.surviveMoney}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['unemployedPeriod'].show && status['commentMayerUnemployedPeriod'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayerUnemployedPeriod', event.target.value, 'end')
          }}
          value={status.commentMayerUnemployedPeriod.answer}
          error={errors.commentMayerUnemployedPeriod}
        />
        </>
        )} 

        {
        // 9.1 How much money you receive monthly retirement? 
        }
        {status['receiveMoney'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('receiveMoney.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('receiveMoney', event.target.value, 'spendDrugs')
              }}
              value={status.receiveMoney.answer}
              error={errors.receiveMoney}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['receiveMoney'].show && status['spendDrugs'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <p className="lead m-lg-0">{t('spendDrugs.question')}</p>
          </div>
          <div className="col-12 col-lg-5">
            <TextField 
              id="outlined-basic" 
              style={{width: '100%'}}
              variant="outlined" 
              onChange={( event ) => {
                
                let {value} = event.target
                let numberRegExp = /[0-9\b]+$/;
                if(value !== "" ) {
                  if (!numberRegExp.test(value))
                    return;
                }
                handleQuestion('spendDrugs', event.target.value, 'commentMayerReceiveMoney')
              }}
              value={status.spendDrugs.answer}
              error={errors.spendDrugs}
              required
              />
          </div>
        </div>
        </>
        )}

        {status['receiveMoney'].show && status['commentMayerReceiveMoney'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayerReceiveMoney', event.target.value, 'end')
          }}
          value={status.commentMayerReceiveMoney.answer}
          error={errors.commentMayerReceiveMoney}
        />
        </>
        )} 

        {
        // 10.1 What would you like to tell the mayor Luis Yd?(The end process) 
        }
        {/* {status['commentMayer'].show && (
        <>
        <hr className="mb-5 mt-5" />
        <MultiInput
          title={t('commentMayer.question')}
          onChange={(event) => {
            handleQuestion('commentMayer', event.target.value, 'end')
          }}
          value={status.commentMayer.answer}
          error={errors.commentMayer}
        />
        </>
        )} */}


        <hr className="mb-5 mt-5" />
        <button className="btn btn-primary" type="submit">
          {t('submit')}
        </button>
      </form>
    </FormBox>
  )
}

export default Form
