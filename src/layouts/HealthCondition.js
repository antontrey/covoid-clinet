import React, { useState, useReducer } from 'react'

import Question from '../components/SelectQuestion'
import InputQuestion from '../components/InputQuestion'
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

const HealthCondition = ({ filledState = {}, setFormState, form }) => {
  const sequence = [
    'symptomsType',
    'suspectedCase',
    'suffering',
    'diseaseMembers',
    'regularVisitors',
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
    else if (typeof cbOrNextQ === 'function') cbOrNextQ()
    else nextQuestion(cbOrNextQ)
  }

  const handleSubmit = e => {
    e.preventDefault()

    // const newErrors = errors
    // let errorPresent = false
    // Object.entries(status).forEach(([key, value]) => {
    //   if (value.show === true && value.answer === '') {
    //     newErrors[key] = true
    //     errorPresent = true
    //   } else {
    //     newErrors[key] = false
    //     console.log(key + " : " + value.answer);
    //   }
    // })
    // setErrors({ ...errors, newErrors })

    // if (!errorPresent) {
      setFormState({ ...form, ...status, progress: 2 })
    // }
  }

  const { t } = useTranslation('healthCondition')

  return (
    <FormBox>
      <form onSubmit={handleSubmit}>

        <>
          <MultipleSelect
            title={t('symptomsType.question')}
            options={[
                t('symptomsType.options.symptomsType1'),
                t('symptomsType.options.symptomsType2'),
                t('symptomsType.options.symptomsType3'),
                t('symptomsType.options.symptomsType4'),
                t('symptomsType.options.symptomsType5'),
                t('symptomsType.options.symptomsType6'),
                t('symptomsType.options.symptomsType7')
            ]}
            onChange={({ value }) => {
              handleQuestion('symptomsType', value, 'suspectedCase')
            }}
            value={status.symptomsType.answer}
            error={errors.symptomsType}
          />
        </>

        {/* {status['suspectedCase'].show && ( */}
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('suspectedCase.question')}
            options={[
              { value: 'suspectedCase1', label: t('suspectedCase.options.suspectedCase1') },
              { value: 'suspectedCase2', label: t('suspectedCase.options.suspectedCase2') }
            ]}
            onChange={({ value }) => {
              handleQuestion('suspectedCase', value, 'suffering')
            }}
            value={status.suspectedCase.answer}
            error={errors.suspectedCase}
          />
        </>
        {/* )} */}

        {status['suffering'].show && (
        <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('suffering.question')}
            options={[
              { value: 'suffering1', label: t('suffering.options.suffering1') },
              { value: 'suffering2', label: t('suffering.options.suffering2') }
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
              }}
              value={status.diseaseMembers.answer}
              error={errors.diseaseMembers}
            />
          </>
        )}

        
        {status['regularVisitors'].show && (
          <>
                <Table borderless responsive style={{marginTop: 70, marginBottom: 50}}>
                  <thead>        
                    <tr style={{backgroundColor: '#dcdcdc', color: 'grey', cursor: 'pointer' }}>
                      <th style={{width: '5%', textAlign: 'center'}}>No</th>
                      <th style={{width: '5%', textAlign: 'center'}}>Relation</th>
                      <th style={{width: '30%', textAlign: 'center'}}>Age</th>
                      <th style={{width: '30%', textAlign: 'center'}}>ID Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      <tr>
                        <td style={{width: '5%', textAlign: 'center'}}>
                          {1}
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <NativeSelect
                            // onChange={this.handlePaymentOption}
                            name="paymentOption"
                            className={{marginTop: 10}}
                            inputProps={{ 'aria-label': 'age' }}
                            style={{marginLeft: 30, fontSize: 18}}
                          >
                            <option value=""> Select Relation </option>
                            <option value="father">Father</option>
                            <option value="mother">Mother</option>
                            <option value="son">Son</option>
                            <option value="daughter">Daughter</option>
                            <option value="other">Other</option>
                          </NativeSelect>           
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <TextField
                            fullWidth
                            helperText=""
                            label=""
                            name="age"
                            placeholder="Age"
                            // onChange={this.payForMeHandleChange(idx)}
                            required
                            // value={item.url}
                          />                        
                        </td>
                        <td style={{width: '30%', textAlign: 'center'}}>
                          <TextField
                            fullWidth
                            helperText=""
                            label=""
                            name="idnumber"
                            placeholder="ID Number"
                            // onChange={this.payForMeHandleChange(idx)}
                            required
                            // value={item.url}
                          />                        
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
          </>
        )}

        {status['regularVisitors'].show && (
          <>
          <hr className="mb-5 mt-5" />
          <Question
            title={t('regularVisitors.question')}
            options={Array.from(Array(9)).map((_, i) => {
              return {
                value: i,
                label: i
              }
            })}
            onChange={({ value }) => {
              handleQuestion('regularVisitors', value, '')
            }}
            value={status.regularVisitors.answer}
            error={errors.regularVisitors}
          />
        </>
        )}

        <hr className="mb-5 mt-5" />
        <button className="btn btn-primary" type="submit">
          {t('submit')}
        </button>
      </form>
    </FormBox>
  )
}

export default HealthCondition
