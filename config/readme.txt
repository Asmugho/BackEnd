CREATE DATATABLE erpizza;

-- Tabela: clientes
CREATE TABLE IF NOT EXISTS public.clientes
(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(40),
    logradouro VARCHAR(60),
    apt INTEGER,
    torre INTEGER
);

-- Tabela: forpgto
CREATE TABLE IF NOT EXISTS public.forpgto
(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20)
);

-- Tabela: produtos
CREATE TABLE IF NOT EXISTS public.produtos
(
    id SERIAL PRIMARY KEY,
    nomeproduto VARCHAR(40),
    valor DOUBLE PRECISION,
    isativo BOOLEAN
);

-- Tabela: pedidos
CREATE TABLE IF NOT EXISTS public.pedidos
(
    id SERIAL PRIMARY KEY,
    pedhora TIME,
    reshora TIME,
    enthora TIME,
    fk_cliente INTEGER,
    valortotal DOUBLE PRECISION,
    fk_forpgto INTEGER,
    isentregue BOOLEAN,
    ispago BOOLEAN,
    CONSTRAINT fk_cliente FOREIGN KEY (fk_cliente) REFERENCES public.clientes(id),
    CONSTRAINT fk_forpgto FOREIGN KEY (fk_forpgto) REFERENCES public.forpgto(id)
);

-- Tabela: pedidoitens
CREATE TABLE IF NOT EXISTS public.pedidoitens
(
    id SERIAL PRIMARY KEY,
    fk_produto INTEGER,
    fk_pedido INTEGER,
    obs VARCHAR(30),
    CONSTRAINT fk_pedido FOREIGN KEY (fk_pedido) REFERENCES public.pedidos(id),
    CONSTRAINT fk_produto FOREIGN KEY (fk_produto) REFERENCES public.produtos(id)
);