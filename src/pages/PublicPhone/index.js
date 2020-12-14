import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Helmet} from "react-helmet";
import CONFIG from '../../config';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha"
import {
        Row,
        Col,
        Button,
        Input,
        Form,
        Select,
        Radio
      } from 'antd';
import InputDocumento from '../../components/InputDocument'
import labelForm from '../../Utils/labelForm'
import { validaCNPJ, validaCPF } from '../../Utils/validators'
import { documentMask, phoneMask } from '../../Utils/mask'
import './styles.css';

const { TextArea } = Input
const { Option } = Select

function PublicPhone() {
  const {
          resultFindPessoa,
          tipoPessoa,
          uf,
          cidades,
          loadingSearch
        } = useSelector((state) => state.pessoa);
  const dispatch = useDispatch();
  const [ formSearch ] = Form.useForm();
  const [ filterUf, setFilterUf ] = React.useState(uf)
  const [ filterCidades, setFilterCidades ] = React.useState([])
  const [ isHuman , setIsHuman ] = React.useState(false)
  const sitekey = CONFIG.REACT_APP_CAPTCHA

  const getCaptcha = value => {
    return new Promise(resolve => {
      dispatch({
        type: 'pessoa/CAPTCHA',
        payload: {
          url: '/captcha',
          dados: {captcha: value},
          resolve
        },
      })
    })
  }

  const onCaptcha = value => {
    getCaptcha(value).then(resp => {
      setIsHuman(resp.isHuman)
      if(resp.isHuman) {
        formSearch.setFields([
          {
            name: 'captcha',
            errors: [''],
          }
        ])
      }
    })

  }

  const onFinish = (values) => {
    dispatch({
      type: 'pessoa/FIND_PESSOA',
      payload: {
        url: '/buscar/pessoas',
        dados: values
      },
    });
  }

  const formatData = (values) => {
    if(values === null) {
      return 'Nenhum resultado foi encontrado para esta pesquisa.'
    }
    let format;
    if(Object.keys(values).length > 0) {
      const tPessoa = values.tipoPessoa === 'J' ? 'Razão Social' : 'Nome'
      const documento = values.tipoPessoa === 'J' ? 'CNPJ' : 'CPF'
      format = `
      ${tPessoa}: ${values.nomeRazao}
      ${documento}: ${documentMask(values.documento)}
      Cidade: ${values.cidade}-${values.uf}
      Telefone: ${phoneMask(values.telefone)}
    `
    }
    return format
  }

  const onTipoPessoa = (input) => {
      dispatch({
        type: 'pessoa/SET_STATE',
        payload: {
          tipoPessoa: input,
        },
      })
  }

  const checkDocumento = (value) => {
    let retorno = false

    if (value.length === 11 || value.length === 14) {
      retorno = tipoPessoa === 'F' ? validaCPF(value) : validaCNPJ(value)
    }

    if (String(value).trim().length <= 0) {
      retorno = true
    }

    if (!retorno) {
      return Promise.reject(
        new Error(`Por favor, informe um ${labelForm[tipoPessoa].tipoPessoa} válido`),
      )
    }
    return Promise.resolve()
  }

  const getUf = React.useCallback(() => {
      dispatch({
        type: 'pessoa/UF',
        payload: {
          url: '/uf'
        },
      });
  },[dispatch])

  const getCidades = (vUF) => {
    formSearch.setFieldsValue({cidade: null})
    dispatch({
      type: 'pessoa/CIDADES',
      payload: {
        url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${vUF}/distritos`
      },
    });
  }

  React.useEffect(() => {
    let mounted = true
    if (mounted) {
      setFilterCidades([])
      getUf()
    }
    return () => {
      mounted = false
    }
  },[getUf])

  React.useEffect(() => {
      setFilterCidades(cidades)
  },[cidades])

  React.useEffect(() => {
    setFilterUf(uf)
},[uf])

  return (
    <>
      <Helmet>
        <title>Oi - Lista Pública de Telefone</title>
      </Helmet>
      <Row style={{padding: '0px 24px 0px 24px'}}>
        <Col span={24} >
          <span className="title-control-people">Lista Pública de Telefone</span>
        </Col>
        <Col span={24}>
          <Form
            form={formSearch}
            onFinish={onFinish}
            initialValues={{ tipoPessoa: tipoPessoa}}
            layout="vertical"
          >
            <Row>
              <Col span={24}>
                <Form.Item name="tipoPessoa">
                  <Radio.Group
                    style={{marginTop: '24px'}}
                    onChange={e => onTipoPessoa(e.target.value)}
                  >
                    <Radio value="F">Pessoa Física</Radio>
                    <Radio value="J">Pessoa Jurídica</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Row gutter={10}>
                  <Col span={24}>
                    <Form.Item
                      label={labelForm[tipoPessoa].tipoPessoa}
                      name="documento"
                      rules={[
                        {
                          required: true,
                          message: `Por favor, forneça ${labelForm[tipoPessoa].tipoPessoa}`,
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value = '') {
                            return checkDocumento(value)
                          },
                        }),
                      ]}
                    >
                      <InputDocumento
                      size="large"
                      format={tipoPessoa === 'J' ? '##.###.###/####-##' : '###.###.###-##'}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="UF"
                      name="uf"
                      rules={[
                        {
                          required: true,
                          message: `Por favor, forneça UF`,
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        size="large"
                        onChange={getCidades}
                        onClick={() => setFilterUf(uf)}
                        onSearch={input =>
                          setFilterUf(uf.filter(u => { return u.uf.toLowerCase().indexOf(input.toLowerCase()) >= 0 }))
                          }
                      >
                        {filterUf &&
                          filterUf.map(item => {
                            return (
                              <Option key={item.uf} value={item.uf}>{item.uf}</Option>
                            )
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Cidade"
                      name="cidade"
                      rules={[
                        {
                          required: true,
                          message: `Por favor, forneça a cidade`,
                        },
                      ]}
                    >
                    <Select
                      showSearch
                      size="large"
                      onClick={() => setFilterCidades(cidades)}
                      disabled={cidades.length <= 0}
                      onSearch={input =>
                        setFilterCidades(cidades.filter(c => { return c.nome.toLowerCase().indexOf(input.toLowerCase()) >= 0 }))
                        }
                    >
                        {filterCidades &&
                          filterCidades.map(item => {
                            return (
                              <Option key={item.nome} value={item.nome}>{item.nome}</Option>
                            )
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                    name="captcha"
                     rules={[
                      ({ getFieldValue }) => ({
                        validator() {
                          if(!isHuman) {
                            return Promise.reject( new Error('Por favor, faça a verificação de que você não é um robô'))
                          }
                           return Promise.resolve()
                        },
                      }),
                    ]}
                    >
                      <Row justify="end">
                        <ReCAPTCHA sitekey={sitekey} onChange={onCaptcha} />
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={loadingSearch}
                        block
                      >
                        Buscar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <TextArea
                    style={{marginTop: "30px"}}
                    value={formatData(resultFindPessoa)}
                    rows={10}
                  />
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Button
            type="link"
          >
            <Link to="/gerenciapessoa">Gerenciar Pessoa</Link>
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default PublicPhone