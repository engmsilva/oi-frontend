import React from 'react';
import store from 'store'
import {Helmet} from "react-helmet";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
import InputDate from '../../components/InputDate'
import InputPhone from '../../components/InputPhone'
import labelForm from '../../Utils/labelForm'
import { validaCNPJ, validaCPF } from '../../Utils/validators'
import './styles.css';

const { Option } = Select

function FormPeople() {
  const {
          tipoPessoa,
          uf,
          cidades,
          loadingCRUD
        } = useSelector((state) => state.pessoa);
  const dispatch = useDispatch();
  const [ peopleForm ] = Form.useForm();
  const { setFieldsValue, resetFields } = peopleForm
  const [ filterUf, setFilterUf ] = React.useState(uf)
  const [ filterCidades, setFilterCidades ] = React.useState([])
  const paramFormPeople = store.get('paramFormPeople')
  const {modeForm, pessoas, selectedPessoa } = paramFormPeople
  const subtitle = modeForm === 'new' ? 'Criação' : 'Alteração'

  const onFinish = (values) => {
    if(modeForm === 'new') {
      dispatch({
        type: 'pessoa/POST',
        payload: {
          url: '/pessoas',
          dados: values
        },
      });
    }
    if(modeForm === 'edit') {
      dispatch({
        type: 'pessoa/PUT',
        payload: {
          url: `/pessoas/${selectedPessoa}`,
          dados: values
        },
      });
    }
  }

  const onTipoPessoa = React.useCallback((input) => {
      dispatch({
        type: 'pessoa/SET_STATE',
        payload: {
          tipoPessoa: input,
        },
      })
  },[dispatch])

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
    setFieldsValue({cidade: null})
    dispatch({
      type: 'pessoa/CIDADES',
      payload: {
        url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${vUF}/distritos`
      },
    });
  }

  const initValues = React.useCallback(() => {
    if (modeForm === 'edit') {
      const filtrarPessoas = pessoas.find(item => item._id === selectedPessoa)
      setFieldsValue(filtrarPessoas)
      onTipoPessoa(filtrarPessoas.tipoPessoa)
    }
    if (modeForm === 'new') {
      onTipoPessoa('F')
      resetFields()
      setFieldsValue({tipoPessoa: 'F'})
    }
  }, [modeForm, pessoas, selectedPessoa, onTipoPessoa, setFieldsValue, resetFields])

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
    let mounted = true
    if (mounted) {
      initValues()
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  React.useEffect(() => {
      setFilterCidades(cidades)
  },[cidades])

  React.useEffect(() => {
    setFilterUf(uf)
},[uf])

  return (
    <>
      <Helmet>
        <title>Oi - {`${subtitle} de Pessoa Física/Jurídica:`}</title>
      </Helmet>
      <Row style={{padding: '0px 24px 0px 24px'}}>
        <Col span={24} >
          <span className="title-control-people">Lista Pública de Telefone</span>
          <span className="subtitle-control-people">{`${subtitle} de Pessoa Física/Jurídica:`}</span>
        </Col>
        <Col span={24}>
          <Form
            form={peopleForm}
            onFinish={onFinish}
            initialValues={{ tipoPessoa: tipoPessoa}}
            layout="vertical"
          >
            <Row gutter={10}>
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
              <Col span={12}>
                <Form.Item
                  label={labelForm[tipoPessoa].nomeRazao}
                  name="nomeRazao"
                  rules={[
                    {
                      required: true,
                      message: `Por favor, forneça ${labelForm[tipoPessoa].nomeRazao}`,
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value = '') {
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input style={{width: '100%'}} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                    style={{width: '100%'}}
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
                    style={{width: '100%'}}
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
              { modeForm === 'new' &&
                <Col span={12}>
                  <Form.Item
                    label={labelForm[tipoPessoa].nascimentoAbertura}
                    name="nascimentoAbertura"
                    rules={[
                      {
                        required: true,
                        message: `Por favor, forneça a data de nascimento`,
                      },
                    ]}
                  >
                    <InputDate />
                  </Form.Item>
                </Col>
              }
              <Col span={12}>
                <Form.Item
                  label="Telefone"
                  name="telefone"
                  rules={[
                    {
                      required: true,
                      message: `Por favor, forneça o telefone`,
                    },
                  ]}
                >
                  <InputPhone />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loadingCRUD}
                    block
                  >
                    Salvar
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Link to="/gerenciapessoa">Voltar a Tela de Lista de Pessoas</Link>
        </Col>
      </Row>
    </>
  );
}

export default FormPeople