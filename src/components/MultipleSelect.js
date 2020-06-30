// import React from 'react';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Input from '@material-ui/core/Input';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
// import Chip from '@material-ui/core/Chip';

// import { useTranslation } from 'react-i18next'

// const Component = ({
//   title,
//   titleList = [],
//   subTitle,
//   options,
//   onChange,
//   value,
//   error
// }) => {
// //   let selectedValue = options.find(option => option.value === value)
// //   if (!selectedValue) selectedValue = null
//   const { t } = useTranslation('SelectQuestion')

//   const customStyles = {
//     control: (base, { selectProps }) => {
//       const boxShadow = selectProps.error
//         ? { boxShadow: '0 0 0 2px #bf215b' }
//         : {}
//       return {
//         ...base,
//         ...boxShadow,
//         transition: ' 0.25s linear',
//         transitionProperty: 'box-shadow'
//       }
//     }
//   }

  
// const useStyles = makeStyles((theme) => ({
//     formControl: {
//       margin: theme.spacing(1),
//       minWidth: 120,
//       maxWidth: 300,
//     },
//     chips: {
//       display: 'flex',
//       flexWrap: 'wrap',
//     },
//     chip: {
//       margin: 2,
//     },
//     noLabel: {
//       marginTop: theme.spacing(3),
//     },
//   }));
  
//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };
  
//   function getStyles(option, personName, theme) {
//     return {
//       fontWeight:
//         personName.indexOf(option) === -1
//           ? theme.typography.fontWeightRegular
//           : theme.typography.fontWeightMedium,
//     };
//   }

//   const classes = useStyles();
//   const theme = useTheme();
//   const [personName, setPersonName] = React.useState([]);

//   const handleChange = (event) => {
//     setPersonName(event.target.value);
//   };

//   return (
//     <div className="row justify-content-center align-items-center">
//       <div className="col-12 col-lg-6">
//         <p className="lead m-lg-0">{title}</p>
//         {titleList.length ? (
//           <>
//             <ul>
//               {titleList.map(e => (
//                 <li>{e}</li>
//               ))}
//             </ul>

//             <small className="m-lg-0">{subTitle}</small>
//           </>
//         ) : (
//           <p className="m-lg-0">{subTitle}</p>
//         )}
//       </div>
//       <div className="col-12 col-lg-5">
//         <Select
//           fullWidth
//           labelId="demo-mutiple-chip-label"
//           id="demo-mutiple-chip"
//           multiple
//           value={personName}
//           onChange={handleChange}
//           input={<Input id="select-multiple-chip" />}
//           renderValue={(selected) => (
//             <div className={classes.chips}>
//               {selected.map((value) => (
//                 <Chip key={value} label={value} className={classes.chip} />
//               ))}
//             </div>
//           )}
//           MenuProps={MenuProps}
//         >
//           {options.map((option) => (
//             <MenuItem key={option} value={option} style={getStyles(option, personName, theme)}>
//               {option}
//             </MenuItem>
//           ))}
//         </Select>

//         {error && (
//           <div className="invalid-feedback" style={{ display: 'block' }}>
//             {t('pleaseChoose')}
//           </div>
//         )}
//         {/* <p>selected value: {JSON.stringify(selectedValue, null, 2)}</p> */}
//       </div>
//     </div>
//   )
// }

// export default Component

import React from 'react'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

const Component = ({
  title,
  titleList = [],
  subTitle,
  options,
  onChange,
  value,
  error
}) => {
  let selectedValue = options.find(option => option.value === value)
  if (!selectedValue) selectedValue = null
  const { t } = useTranslation('SelectQuestion')

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

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-12 col-lg-6">
        <p className="lead m-lg-0">{title}</p>
        {titleList.length ? (
          <>
            <ul>
              {titleList.map(e => (
                <li>{e}</li>
              ))}
            </ul>

            <small className="m-lg-0">{subTitle}</small>
          </>
        ) : (
          <p className="m-lg-0">{subTitle}</p>
        )}
      </div>
      <div className="col-12 col-lg-5">
        <Select
          options={[{ value: null, label: `- ${t('default')} -` }, ...options]}
          isMulti
          isSearchable={false}
          onChange={onChange}
          value={selectedValue}
          styles={customStyles}
          error={error}
          placeholder={t('placeholder')}
        />
        {error && (
          <div className="invalid-feedback" style={{ display: 'block' }}>
            {t('pleaseChoose')}
          </div>
        )}
        {/* <p>selected value: {JSON.stringify(selectedValue, null, 2)}</p> */}
      </div>
    </div>
  )
}

export default Component
