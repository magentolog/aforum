<?php

class Topic_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function getTopicList() {
        $this->db->select('t.*, u.nickname');
        $this->db->from('topics t');
        $this->db->join('users u', 'u.id = t.user_id');
        return $this->db->get()->result_array();
    }

}
