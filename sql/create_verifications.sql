-- Table: public.verifications

-- DROP TABLE public.verifications;

CREATE TABLE public.verifications
(
  id character varying(66) NOT NULL, -- Identifier
  device_key character varying(66) NOT NULL, -- DeviceKey
  phone_number character varying(66) NOT NULL, -- PhoneNumber
  code character varying(6) NOT NULL, -- Code
  created timestamp with time zone  NOT NULL DEFAULT now(), --Created on
  CONSTRAINT verifications_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.verifications
  OWNER TO root;

