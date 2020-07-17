--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3 (Debian 12.3-1.pgdg100+1)
-- Dumped by pg_dump version 12.3 (Debian 12.3-1.pgdg100+1)
--
-- TOC entry 202 (class 1259 OID 47628)
-- Name: objects; Type: TABLE; Schema: public; Owner: xyh
--

CREATE TABLE public.objects (
    data jsonb NOT NULL,
    id bigint NOT NULL
);

--
-- TOC entry 204 (class 1259 OID 47650)
-- Name: activities; Type: VIEW; Schema: public; Owner: xyh
--

CREATE VIEW public.activities AS
 SELECT objects.data
   FROM public.objects
  WHERE ((objects.data ->> 'type'::text) = ANY (ARRAY['Accept'::text, 'Add'::text, 'Announce'::text, 'Arrive'::text, 'Block'::text, 'Create'::text, 'Delete'::text, 'Dislike'::text, 'Flag'::text, 'Follow'::text, 'Ignore'::text, 'Invite'::text, 'Join'::text, 'Leave'::text, 'Like'::text, 'Listen'::text, 'Move'::text, 'Offer'::text, 'Question'::text, 'Reject'::text, 'Read'::text, 'Remove'::text, 'TentativeReject'::text, 'TentativeAccept'::text, 'Travel'::text, 'Undo'::text, 'Update'::text, 'View'::text]));


--
-- TOC entry 203 (class 1259 OID 47646)
-- Name: actors; Type: VIEW; Schema: public; Owner: xyh
--

CREATE VIEW public.actors AS
 SELECT objects.data
   FROM public.objects
  WHERE ((objects.data ->> 'type'::text) = ANY (ARRAY['Application'::text, 'Group'::text, 'Organization'::text, 'Person'::text, 'Service'::text]));


--
-- TOC entry 205 (class 1259 OID 47654)
-- Name: objects_id_seq; Type: SEQUENCE; Schema: public; Owner: xyh
--

CREATE SEQUENCE public.objects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2929 (class 0 OID 0)
-- Dependencies: 205
-- Name: objects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xyh
--

ALTER SEQUENCE public.objects_id_seq OWNED BY public.objects.id;


--
-- TOC entry 2790 (class 2604 OID 47656)
-- Name: objects id; Type: DEFAULT; Schema: public; Owner: xyh
--

ALTER TABLE ONLY public.objects ALTER COLUMN id SET DEFAULT nextval('public.objects_id_seq'::regclass);

--
-- TOC entry 2793 (class 2606 OID 47666)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: public; Owner: xyh
--

ALTER TABLE ONLY public.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 2791 (class 1259 OID 47668)
-- Name: objects_data_id_idx; Type: INDEX; Schema: public; Owner: xyh
--

CREATE UNIQUE INDEX objects_data_id_idx ON public.objects USING btree (((data ->> 'id'::text)));


-- Completed on 2020-07-17 18:50:50 CST

--
-- PostgreSQL database dump complete
--

