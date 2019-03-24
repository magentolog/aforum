<?php
const TABLE = 'locations';
class Locations_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function getAll() {
        $this->db->select('*');
        $this->db->from(TABLE);
        return $this->db->get()->result_array();
    }

    public function get($id) {
        $this->db->select('*');
        $this->db->from(TABLE);
        $this->db->where('id', $id);
        return $this->db->get()->row_array();
    }

    public function add($post) {
        unset($post['id']);
        $this->db->insert(TABLE, $post);
        $id = $this->db->insert_id();
        if (!empty($id)) {
            $result = $this->db->get_where(TABLE, array('id' => $id))->row_array();
            return $result;
        } else {
            return FALSE;
        }
    }

    public function edit($post) {
        $id = $post['id'];
        unset($post['id']);
        $this->where('id', $id);
        $this->db->update(TABLE, $post);
    }

    public function delete($id) {
        $this->where('id', $id);
        $this->db->delete(TABLE);
    }

}
