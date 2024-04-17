import React, { useState, useRef, useEffect } from 'react';
import { Container ,Box, Button, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const defaultTheme = createTheme();

function checkResult(result) {
    if(isNaN(result) || result===Infinity || typeof result === 'string'){
        return '変な計算しないで！！！'
    }
    return result
}

const useCalculator = () => {
    const [numbers, setNumbers] = useState('0');
    const [result, setResult] = useState(0);
    const [operator, setOperator] = useState();
    const [calicFlag, setCalicFlag] = useState(false);
    const [isAllCrear, setIsAllCrear] = useState(false);
    const [pointInValid, setPointInValid] = useState(false);
    const [inversion, setInversion] = useState('');
    const caliculatorRef = useRef(null);

    useEffect(() => {console.log('NUMBER IS',numbers)},[numbers])

    const handleNumber = (num) => {
        if(typeof result === 'string'){
            setResult(0);
            setNumbers('0')
            setOperator('')
        }
        if(numbers.length > 14){
            return;
        }
        if(isAllCrear){
            setIsAllCrear(false)
        }
        if(calicFlag){
            caliculatorRef.current = num
            setInversion('')
            setNumbers(num);
            setCalicFlag(false);
            setOperator('');
            setResult(0);
            return
        }
        caliculatorRef.current = num
        if(num === '.' && pointInValid) {
            return
        }
        if(num === '.'){
            setPointInValid(true);
            setNumbers((prevNumber) => (
                prevNumber+num
            ));
            return
        }
        setNumbers((prevNumber) => (
            prevNumber === "0" ? num: prevNumber+num
        ));
    }

    const handleClear = () => {
        if(isAllCrear){
            setResult(0);
            setIsAllCrear(false)
            return ;
        }
        setNumbers('0');
        caliculatorRef.current = numbers;
        setIsAllCrear(true);
    }

    const handleCalic = (text) => {
        caliculatorRef.current = null;
        if(text === 'clear') {
            handleClear();
            return
        }
        if(text === 'percent') {
            if(result === 0){
                setResult(() => (
                    numbers==='0'?0:Number(numbers)*0.01
                ))
            }else{
                setResult(Number(result)*0.01)
            }
            caliculatorRef.current = false
            return
        }
        if(!operator){
            setOperator(text);
            setResult(Number(numbers));
            setNumbers('0');
            return;
        };
        if(operator !== text&&text !== 'equal') {
            console.log(numbers,result,operator,text,'NOW')
            setOperator(text)
            setNumbers('0')
            setCalicFlag(false)
            return;
        }
        switch(operator) {
            case 'add':
                setResult((prevResult)=>(
                    checkResult(prevResult+Number(numbers))
                ));
                break;
            case 'minus':
                setResult((prevResult)=>(
                    checkResult(prevResult-Number(numbers))
                ));
                break;
            case 'mult':
                setResult((prevResult)=>(
                    checkResult(prevResult*Number(numbers))
                ));
                break;
            case 'divide':
                setResult((prevResult)=>(
                    checkResult(prevResult/Number(numbers))
                ));
                break;
            case 'inversion':
                setInversion(inversion='-'?'':'-');
                setNumbers((prevNumber) => (
                    inversion+prevNumber
                ));
                break;
            default:
                setIsAllCrear(false);
                break;
        }
        setCalicFlag(text === 'equal' || text === 'clear');
        setOperator((prevOperator) => (
            text === 'equal' ? prevOperator: text
        ));
    }

    return { numbers, result, caliculatorRef, handleNumber, handleCalic, isAllCrear }
}

function Top() {
  const { numbers, result, caliculatorRef, handleNumber, handleCalic, isAllCrear } = useCalculator();
  const buttonNums = ['C','0' , '.', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const operatorLabel = ['+', '-', '×', '÷', '%', '='];
  const operatorValue = ['add', 'minus', 'mult', 'divide', 'percent', 'equal'];

  const [operatorIndex, setOperatorIndex] = useState({left: 4, center: 0, right: 1})

  const operators = operatorLabel.map((elem, idx) => {
    return{
        id: idx,
        label: elem,
        value: operatorValue[idx]
    }
  })

  function ThreeIconSlider(direct) {
    function checkLimit(num){
        if(num > operators.length-1) return 0;
        if(num < 0) return operators.length-1;
        return num
    }
    if(direct==='back'){
        setOperatorIndex((prev) => ({
            left:prev.center, center:prev.right, right: checkLimit(prev.right+1)
        }))
    }
    if(direct==='next'){
        setOperatorIndex((prev) => ({
            left: checkLimit(prev.left-1), center:prev.left, right:prev.center
        }))
    }
  }

  const renderNum = caliculatorRef.current ? numbers : result;
  console.log(String(renderNum).length, renderNum, numbers, result,caliculatorRef.current )

  return (
    <ThemeProvider theme={defaultTheme}>
        <Container
            component="main"
            maxWidth="sm"
            alignitems={'center'}
        >
            <Box
                maxWidth={'255px'}
                alignItems={'center'}
                textAlign={'center'}
                alignSelf={'center'}
                padding={'10px 30px'}
                marginLeft={'auto'}
                marginRight={'auto'}
            >

                <Box
                    textAlign={'center'}
                    padding={'30px 0'}
                    height={'2rem'}
                    fontSize={String(renderNum).length>14?'1rem':adjustFontSize(renderNum, { max: 2, min: 1.5, base: 8 }) }
                >
                    {renderNum}
                </Box>
                <Box>
                    <Box>
                    {buttonNums.reverse().map((elem) => {
                        if( elem==='C') {
                            if(isAllCrear){
                                elem='AC'
                            }
                            return(
                                <Button
                                    onClick={()=>handleCalic('clear')}
                                    ref={caliculatorRef}
                                    key={elem}
                                >
                                    {elem}
                                </Button>
                            )
                        }
                        return(
                            <Button
                                onClick={()=>handleNumber(elem)}
                                key={elem}
                                ref={caliculatorRef}
                            >
                                {elem}
                            </Button>
                        )})
                    }
                    </Box>

                    <Box
                        css={{}}
                        display={'flex'}
                    >
                        <IconButton
                            onClick={() => {ThreeIconSlider('back')}}
                            size='small'
                        >
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                            <Button disabled size='small'>
                                {operators[operatorIndex.left].label}
                            </Button>
                            <Button
                                onClick={()=>handleCalic(operators[operatorIndex.center].value)}
                                ref={caliculatorRef}
                                size='large'
                                sx={{fontSize:'2rem'}}
                            >
                                {operators[operatorIndex.center].label}
                            </Button>
                            <Button disabled size='small'>
                                {operators[operatorIndex.right].label}
                            </Button>
                        <IconButton
                            onClick={() => {ThreeIconSlider('next')}}
                            size='small'
                        >
                            <ArrowForwardIosIcon/>
                        </IconButton>
                    </Box>
                </Box>

            </Box>
        </Container>
    </ThemeProvider>
  )
}

export default Top

const adjustFontSize = (text, { max, min, base }) => {
    if(text==='変な計算しないで！！！') return '1rem'
    const textLength = typeof text !== 'string' ? String(text).length + 1: text.length + 1;

    if(textLength <= base) return `${max}rem`;

    const ratio = max / base;
    const diff = Math.ceil(textLength * ratio);
    console.log(text, textLength,base,textLength <= base, `${Math.max(min, max - (diff - max))}rem`)

    return`${Math.max(min, max - (diff - max))}rem`;
}

