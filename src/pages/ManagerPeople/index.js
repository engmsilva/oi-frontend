import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Helmet} from "react-helmet";
import store from 'store'
import { Link, useHistory } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
        Row,
        Col,
        Button,
        Space,
        Table,
        Popconfirm,
        Tooltip
      } from 'antd';
import { documentMask, phoneMask } from '../../Utils/mask'
import './styles.css';


const columns = props => [
  {
    title: 'Tipo',
    dataIndex: 'tipoPessoa',
    key: 'tipoPessoa',
    render: type => {
      return type === 'J' ? 'Jurídica' : 'Física'
    }
  },
  {
    title: 'Nome/Razão Social',
    dataIndex: 'nomeRazao',
    key: 'nomeRazao',
  },
  {
    title: 'CPF/CNPJ',
    dataIndex: 'documento',
    key: 'documento',
    render: doc => {
      return documentMask(doc)
    }
  },
  {
    title: 'Telefone',
    dataIndex: 'telefone',
    key: 'telefone',
    render: phone => {
      return phoneMask(phone)
    }
  },
  {
    title: 'Cidade',
    dataIndex: 'cidade',
    key: 'cidade',
  },
  {
    title: 'Ações',
    key: 'action',
    align: 'center',
    render: obj => (
       <Space size="large">
         <Tooltip placement="bottomRight" title="Editar">
          <EditOutlined onClick={() => props.edit(obj._id)} />
        </Tooltip>
        <Popconfirm
          title={`Deseja excluir?`}
          onConfirm={() => props.remove(obj._id)}
          onCancel={() => {}}
          okText="Sim"
          cancelText="Não"
        >
          <Tooltip placement="bottomRight" title="Excluir">
            <DeleteOutlined />
          </Tooltip>
        </Popconfirm>
     </Space>
    ),
  },
];

export default function ManagerPeople() {
  const { pessoas, loadingCRUD } = useSelector((state) => state.pessoa);
  const dispatch = useDispatch();
  let history = useHistory();

  const edit = id => {
    store.set('paramFormPeople', {
      modeForm: 'edit',
      selectedPessoa: id,
      pessoas: pessoas
    })
    history.push('/pessoa')
  }

  const remove = id => {
    const filterPessoa = pessoas.filter(p => p._id.indexOf(id) === -1)
    dispatch({
      type: 'pessoa/REMOVE',
      payload: {
        url: `/pessoas/${id}`,
        dados: filterPessoa
      },
    });
  }

  const getPessoas = React.useCallback(() => {
    dispatch({
      type: 'pessoa/GET',
      payload: {
        url: '/pessoas'
      },
    });
  },[dispatch])

  React.useEffect(() => {
    let mounted = true
    if (mounted) {
      getPessoas()
    }
    return () => {
      mounted = false
    }
  },[getPessoas])
 

  return (
    <>
      <Helmet>
        <title>Oi - Gerencimento de Pessoas Físicas e Jurídicas</title>
      </Helmet>
      <Row style={{padding: '0px 24px 0px 24px'}}>
        <Col span={24} >
          <Row justify="space-between">
            <span className="title-control-people">Gerencimento de Pessoas Físicas e Jurídicas</span>
            <Button
              type="primary"
              onClick={() => store.set('paramFormPeople', {modeForm: 'new'})}
            >
              <Link
                to={{pathname: "/pessoa"}}
              >
                Criar Nova Pessoa
              </Link>
            </Button>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            loading={loadingCRUD}
            style={{marginTop: "24px"}}
            dataSource={pessoas}
            columns={columns({edit, remove})}
            pagination={{ position: ['bottomCenter'], pageSize: 5 }}
          />
        </Col>
        <Col span={24}>
          <Button
            type="link"
          >
            <Link to="/">Volta à Tela de Pesquisa de Telefone</Link>
          </Button>
        </Col>
      </Row>
    </>
  );
}