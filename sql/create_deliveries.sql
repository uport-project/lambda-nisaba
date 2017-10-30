-- Table: public.deliveries

-- DROP TABLE public.deliveries;

CREATE TABLE public.deliveries
(
  id character varying(66) NOT NULL, -- Identifier
  verification_id character varying(66) NOT NULL, -- Identifier of Verification
  channel character varying(64) NOT NULL, -- Delivery Channel
  provider_id character varying(64) NOT NULL, -- Provider message:id
  status character varying(64) NOT NULL, -- Delivery Status
  created timestamp with time zone  NOT NULL DEFAULT now(), --Created on
  CONSTRAINT deliveries_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.deliveries
  OWNER TO root;

